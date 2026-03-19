const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    year: { type: Number },
    synopsis: { type: String, trim: true },
    coverImage: { type: String }, // URL de la portada (Cloudinary en los próximos pasos)
    pages: { type: Number },
    language: { type: String, default: "Español", trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema, "books");
module.exports = Book;
