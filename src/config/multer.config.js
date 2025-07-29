import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Función genérica para crear storage dinámico
const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), `uploads/${folder}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, nombreArchivo);
    }
  });

// ✅ Filtro para validar imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp|avif/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  if (tiposPermitidos.test(ext)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Solo se permiten imágenes (jpg, png, gif, webp, avif)";
    cb(null, false);
  }
};

// ✅ Multer para productos (sin cambios)
export const upload = multer({
  storage: createStorage("products"),
  fileFilter
});

// ✅ Multer para carrusel (nuevo)
export const uploadCarousel = multer({
  storage: createStorage("carousel"),
  fileFilter
});