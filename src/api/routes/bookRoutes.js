const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require("../controllers/bookControllers");

const bookRoutes = require("express").Router();

// Rutas públicas
bookRoutes.get("/", getAllBooks);
bookRoutes.get("/:id", getBook);

// Rutas protegidas
bookRoutes.post("/", [isAuth], createBook);
bookRoutes.put("/:id", [isAuth], updateBook);
bookRoutes.delete("/:id", [isAuth], deleteBook);

module.exports = bookRoutes;
