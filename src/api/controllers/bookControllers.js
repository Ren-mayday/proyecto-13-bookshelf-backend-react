//! CRUD -> CREATE/POST, READ/GET, UPDATE, DELETE
const Book = require("../models/Book");

//! GET todos los libros
const getAllBooks = async (req, res) => {
  try {
    const { title, author, createdBy } = req.query; // params de la URL (?title=...&author=...)
    const filter = {}; // Empieza con filtro vacío - si no hay params, devuelve todos los libros

    if (title) filter.title = new RegExp(title, "i"); // ignora mayúsculas y minúsculas
    if (author) filter.author = new RegExp(author, "i");
    if (createdBy) filter.createdBy = createdBy;

    const books = await Book.find(filter).populate("createdBy", "userName email").sort({ createdAt: -1 }); // de más nuevo a más antiguo

    return res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Error en obtener los libros",
      error: error.message,
    });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("createdBy", "userName email");

    if (!book) {
      return res.status(404).json("Libro no encontrado");
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el libro",
      error: error.message,
    });
  }
};

//! POST
const createBook = async (req, res) => {
  try {
    const { title, author, genre, year, synopsis, coverImage, pages, language } = req.body;

    if (!title || !author || !genre || !synopsis) {
      return res.status(400).json("Faltan campos obligatorios");
    }

    const duplicatedBook = await Book.findOne({ title, author });
    if (duplicatedBook) {
      return res.status(409).json("Ya existe un libro con el mismo título y author");
    }

    const newBook = new Book({
      title,
      author,
      genre,
      year,
      synopsis,
      coverImage,
      pages,
      language,
      createdBy: req.user._id, // guarda quién lo creó
    });

    const savedBook = await newBook.save();
    return res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el libro",
      error: error.message,
    });
  }
};

//! UPDATE
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle, newAuthor, newGenre, newYear, newSynopsis, newCoverImage, newPages, newLanguage } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json("Libro no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(book.createdBy);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No puedes modificar este libro");
    }

    if (newTitle && newTitle !== book.title) {
      const exists = await Book.findOne({ title: newTitle });
      if (exists) return res.status(409).json("Ya existe un libro con ese título");
      book.title = newTitle;
    }

    if (newAuthor) book.author = newAuthor;
    if (newGenre) book.genre = newGenre;
    if (newYear) book.year = newYear;
    if (newSynopsis) book.synopsis = newSynopsis;
    if (newCoverImage) book.coverImage = newCoverImage;
    if (newPages) book.pages = newPages;
    if (newLanguage) book.language = newLanguage;

    const updatedBook = await book.save();
    return res.status(200).json({ message: "Libro actualizado correctamente", book: updatedBook });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el libro",
      error: error.message,
    });
  }
};

//! DELETE
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json("Libro no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(book.createdBy);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para eliminar este libro");
    }

    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Libro eliminado correctamente",
      bookDeleted: book,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el libro",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
