import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

// Función para extraer el token desde la cookie
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt; // Obtenemos la cookie llamada 'jwt'
  }
  return token;
};

// Configuración de la estrategia JWT
const opts = {
  jwtFromRequest: cookieExtractor, // Le decimos que use el extractor personalizado
  secretOrKey: process.env.JWT_SECRET // Clave secreta para verificar el token
};

// Registramos la estrategia en Passport
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => { /* Aqui le decimos lo siguiente, passport esta es mi estrategia
  vas a usar opts que es mi extractor, si el extractor funcion y me trae una cookie con su token vas a usar el payload de esta
  cookkie y vas a continuar con la funcion por medio del done que usa passport para indicar continuar, por eso damos estos 2 parametros*/
  try {
    // Buscamos el usuario con el ID contenido en el payload del token
    const user = await User.findById(jwt_payload.id);
    if (user) return done(null, user); // Si existe, se autentica
    else return done(null, false);     // Si no existe, se rechaza
  } catch (err) {
    return done(err, false); // Error en la verificación
  }
}));

export default passport;
