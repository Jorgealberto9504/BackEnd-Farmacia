import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, default: "" },
  imagen: { type: String, required: true }, // ruta de la imagen subida
  link: { type: String, default: "" },
  creadoEn: { type: Date, default: Date.now }
});

export const Carousel = mongoose.model("Carousel", carouselSchema);