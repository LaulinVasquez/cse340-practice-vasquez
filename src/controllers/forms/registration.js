import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import {
  emailExists,
  saveUser,
  getAllUsers,
} from "../../models/forms/registration.js";

const router = Router();
//  Validation rules for user registration

const registrationValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid address"),
  body("emailConfirm")
    .trim()
    .custom((value, { req }) => value === req.body.email)
    .withMessage("Email address must match"),
  body("password")
    .isLength({ min: 8 })
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password must match"),
];

//  Display the registration form page.

const showRegistrationForm = (req, res) => {
  res.render("forms/registration/form", {
    title: "User Registration",
  });
};

const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error("Validation erros", errors.array());
    return res.render("forms/registration/form", {
      title: "User Registration",
    });
  }

  const { name, email, password } = req.body;

  try {
    if (emailExists(email)) {
      console.log("Email already registered");
      return res.render("/register", {
        title: "User Registration",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await saveUser(name, email, hashedPassword);
    console.log("user registered successfully");
    res.redirect("/register");
  } catch (error) {
    console.error("Hey something went wrong, check it out:", error);
    res.redirect("/register");
  }
};

// Display all registered users.

const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];
    try {
        users = getAllUsers();
    } catch (error) {
        console.error("Error retriving users", error)
    }
    res.render("forms/registration/list", {
        title: "Registered Users"
    })
};
// GET / register - Display the registration form
router.get("/", showRegistrationForm)
// POST /register - Handle registration form submission with validation
router.post("/", registrationValidation, processRegistration);
// GET /register/list - Display all registered users
router.get("/list", showAllUsers);

export default router;