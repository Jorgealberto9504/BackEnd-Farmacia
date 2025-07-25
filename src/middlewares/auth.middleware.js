import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Debes estar autenticado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const soloUsuario = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado. Debes estar autenticado.' });
  }

  if (req.user.role !== 'usuario') {
    return res.status(403).json({ message: 'Acceso prohibido. Solo usuarios autorizados.' });
  }

  next();
};

export const soloAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado. Debes estar autenticado.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso prohibido. Solo administradores.' });
  }

  next();
};