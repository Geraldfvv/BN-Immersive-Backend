const throwError = require("../helpers/error.helper");
const { db } = require("../config/connection.config");
const Users = db.collection("Users");

signInValidate = async (req, res, next) => {
  let errors = {};
  const {
    fullName,
    id,
    idPhoto,
    incomeSource,
    email,
    password,
    confirmPassword,
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const incomeSourceEnum = [
    "salaried",
    "bussinesOwner",
    "selfEmployed",
    "retired",
    "investor",
    "other",
  ];

  // Id required, format and unique
  if (id) {
    const uniqueId = await Users.where("id", "==", id).get();
    if (!uniqueId.empty) {
      errors.id = "ID already used!";
    }
  } else {
    errors.id = "ID is required!";
  }

  // Email required, email format and unique
  if (email) {
    const uniqueEmail = await Users.where("email", "==", email).get();
    if (!uniqueEmail.empty) {
      errors.email = "Email already used!";
    } else if (!emailRegex.test(email)) {
      errors.email = "This is not a valid email format!";
    }
  } else {
    errors.email = "Email is required!";
  }

  //Full Name required
  if (!fullName) {
    errors.fullName = "Email is required!";
  }

  //Password 8 char long , one number , min and mayus , encrypted
  if (!password) {
    errors.idPhoto = "Password is required!";
  }

  //Same as password
  if (!confirmPassword) {
    errors.confirmPassword = "Password confirmation is required!";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  //Source of income required and valid option
  if (!incomeSource) {
    errors.incomeSource = "Source of income is required!";
  } else if (!incomeSourceEnum.includes(incomeSource)) {
    errors.incomeSource = "Invalid income source option";
  }

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    try {
      res.status(400);
      res.json({ errors: errors, status: 400 });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = signInValidate;
