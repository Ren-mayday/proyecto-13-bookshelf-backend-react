const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const { getAllReviews, createReview, updateReview, deleteReview } = require("../../api/controllers/reviewControllers");

const reviewRoutes = require("express").Router();

//Ruta pública
reviewRoutes.get("/", getAllReviews);

reviewRoutes.post("/:bookId", [isAuth], createReview);
reviewRoutes.put("/:id", [isAuth], updateReview);
reviewRoutes.delete("/:id", [isAuth], deleteReview);

module.exports = reviewRoutes;
