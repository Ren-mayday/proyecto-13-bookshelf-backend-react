const fs = require("fs");
const Review = require("../api/models/Review");
const User = require("../api/models/User");
const Book = require("../api/models/Book");

const reviewsData = fs.readFileSync("./src/data/reviews.csv", "utf-8");

const reviewsCsvArrayOfObjects = (reviewsData) => {
  const lines = reviewsData.split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : "";
      return obj;
    }, {});
  });
};

const reviews = reviewsCsvArrayOfObjects(reviewsData);

const seedReviews = async () => {
  await Review.deleteMany();

  for (const review of reviews) {
    const user = await User.findOne({ userName: review.userName });
    const book = await Book.findOne({ title: review.bookTitle });

    if (user && book) {
      await Review.create({
        user: user._id,
        book: book._id,
        rating: review.rating,
        comment: review.comment,
      });
    }
  }
  console.log("Reviews insertadas correctamente 📝✅");
};

module.exports = { seedReviews };
