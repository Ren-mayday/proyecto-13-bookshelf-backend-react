//! CRUD -> CREATE/POST, READ/GET, UPDATE, DELETE
const Review = require("../models/Review");
const User = require("../models/User");
const Book = require("../models/Book");

const getAllReviews = async (req, res) => {
  try {
    const { bookId, userId } = req.query;
    const filter = {};

    if (bookId) filter.book = bookId;
    if (userId) filter.user = userId;

    const reviews = await Review.find(filter)
      .populate("user", "userName avatar")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las reviews",
      error: error.message,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!bookId || !rating || !comment || !userId) {
      return res.status(400).json("Faltan campos obligatorios");
    }

    const existingReview = await Review.findOne({ user: userId, book: bookId });
    if (existingReview) {
      return res.status(409).json("Ya has escrito una review para este libro");
    }

    const newReview = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la review",
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { newComment, newRating } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json("Review no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(review.user);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No puedes modificar esta reseña");
    }

    if (newComment) review.comment = newComment;
    if (newRating) review.rating = newRating;

    const updatedReview = await review.save();
    return res.status(200).json({ message: "Review actualizada correctamente", review: updatedReview });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la review",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json("Review no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(review.user);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para eliminar este review");
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Review eliminada correctamente",
      reviewDeleted: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la review",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
};
