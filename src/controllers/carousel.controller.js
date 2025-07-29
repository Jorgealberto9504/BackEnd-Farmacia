import { Carousel } from "../models/carousel.model.js";

// 🔹 Obtener todas las imágenes del carrusel
export const getCarouselImages = async (req, res) => {
  try {
    const images = await Carousel.find().sort({ creadoEn: -1 });
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imágenes", error: error.message });
  }
};

// 🔹 Subir nueva imagen
export const addCarouselImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se envió ninguna imagen" });

    const nueva = await Carousel.create({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion || "",
      link: req.body.link || "",
      imagen: `/uploads/carousel/${req.file.filename}`
    });

    // ✅ Emitir evento de actualización en tiempo real
    req.io.emit("carouselUpdated");

    res.status(201).json({ message: "Imagen agregada al carrusel", nueva });
  } catch (error) {
    res.status(500).json({ message: "Error al subir imagen", error: error.message });
  }
};

// 🔹 Eliminar imagen
export const deleteCarouselImage = async (req, res) => {
  try {
    const eliminado = await Carousel.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Imagen no encontrada" });

    req.io.emit("carouselUpdated");

    res.status(200).json({ message: "Imagen eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar imagen", error: error.message });
  }
};