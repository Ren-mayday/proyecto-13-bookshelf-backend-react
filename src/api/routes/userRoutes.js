const { isAdmin } = require("../../middlewares/isAdmin");
const { isAuth } = require("../../middlewares/isAuth");
const {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const userRoutes = require("express").Router();

userRoutes.get("/", [isAuth, isAdmin], getAllUsers);
userRoutes.get("/user/:id", [isAuth], getUser);

//Registro y login
userRoutes.post("/register", registerUser);

userRoutes.post("/login", loginUser);

// Update -> solo autenticados, admin o usuario normal
userRoutes.put("/update/:id", [isAuth], updateUser);

// Delete -> solo autenticados (admin o users así mismos)
userRoutes.delete("/:id", [isAuth], deleteUser);

module.exports = userRoutes;
