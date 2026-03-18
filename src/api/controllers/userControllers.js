//! CRUD -> CREATE/POST, READ/GET, UPDATE, DELETE
const { generateSign } = require("../../config/jwt.js");
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const bcrypt = require("bcrypt");

//! GET obtener todos los usuarios (sólo admin)
const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json("No tienes permisos para ver todos los usuarios");
    }
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json("No tienes permisos, ni eres usuario para realizar esta acción");
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.toString() === id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para ver este usuario");
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

//!POST /user registrar user normal
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Validaciones:
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Este email no es válido, por favor, registra un email con el formato correcto" });
    }

    if (await User.findOne({ userName })) {
      return res.status(409).json("Este usuario ya existe. Por favor, indica otro nombre de usuario.");
    }

    if (await User.findOne({ email })) {
      return res.status(409).json("Este email ya existe. Por favor, registra otro email.");
    }

    const newUser = new User({ userName, email, password });
    const userSaved = await newUser.save();

    userSaved.password = undefined;

    return res.status(201).json({ message: "Usuario registrado correctamente", user: userSaved });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

//! POST /login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const errorMessage = "Usuario o contraseña incorrectos";

    if (!user) {
      return res.status(404).json({ message: errorMessage });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: errorMessage });
    }

    const token = generateSign(user.id);

    return res.status(200).json({
      message: "Te has logueado correctamente",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor al intentar loguear", error: error.message });
  }
};

//! Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUserName, newEmail, newPassword, newRole, currentPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(user._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No puedes modificar este usuario");
    }

    if (!isAdmin) {
      if (!currentPassword) {
        return res.status(400).json("Debes introducir tu contraseña actual para actualizar tus datos");
      }

      const isValidPass = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPass) {
        return res.status(401).json("La contraseña actual es incorrecta");
      }
    }

    // Campos editables

    // Role (sólo admin)
    if (newRole) {
      if (!isAdmin) {
        return res.status(403).json("Sólo admin puede cambiar roles");
      }
      if (!["admin", "user"].includes(newRole)) {
        return res.status(400).json("Role inválido, Debe ser 'admin o 'user'");
      }
      if (user.role !== newRole) {
        user.role = newRole;
      }
    }

    // Nuevo nombre de usuario y comprobación que no sea la misma que la anterior
    if (newUserName && newUserName !== user.userName) {
      const exists = await User.findOne({ userName: newUserName });
      if (exists) return res.status(409).json("Este nombre de usuario ya existe");
      user.userName = newUserName;
    }

    if (newEmail && newEmail !== user.email) {
      const exists = await User.findOne({ email: newEmail });
      if (exists) return res.status(409).json("Este email ya está registrado");
      user.email = newEmail;
    }

    if (newPassword) {
      const same = await bcrypt.compare(newPassword, user.password);
      if (same) {
        return res.status(400).json("La nueva contraseña no puede ser igual que la anterior");
      }
      user.password = newPassword;
    }

    const updated = await user.save();

    const userObj = updated.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Usuario actualizado correctamente ✅🎉",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en actualizar el usuario",
      error: error.message,
    });
  }
};

//!DELETE
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.equals(user._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para eliminar a este usuario");
    }

    await Review.deleteMany({ user: id }); // Elimina todas las reseñas del usuario
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Usuario y sus libros asociados, han sido eliminados",
      userDeleted: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
