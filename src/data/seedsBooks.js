const fs = require("fs");
const Book = require("../api/models/Book");
const User = require("../api/models/User");

const booksData = fs.readFileSync("./src/data/books.csv", "utf-8");

const booksCsvArrayOfObjects = (booksData) => {
  const lines = booksData.split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : "";
      return obj;
    }, {});
  });
};

const books = booksCsvArrayOfObjects(booksData);

const seedBooks = async () => {
  await Book.deleteMany();
  const anyUser = await User.findOne();
  const booksWithCreator = books.map((book) => ({ ...book, createdBy: anyUser._id }));
  await Book.insertMany(booksWithCreator);
  console.log("Libros insertados correctamente 📚✅");
};

module.exports = { seedBooks };
