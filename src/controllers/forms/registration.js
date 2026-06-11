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
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, hyphens, and apostrophes"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid address")
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),
  body("emailConfirm")
    .trim()
    .custom((value, { req }) => value === req.body.email)
    .withMessage("Email address must match"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character"),
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password must match"),
];

//  Display the registration form page.

const showRegistrationForm = (req, res) => {
  res.render("./forms/registration/form", {
    title: "User Registration",
  });
};

const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash("error", error.msg);
    })
    return res.render("forms/registration/form", {
      title: "User Registration",
    });
  }

  const { name, email, password } = req.body;


  try {
    if (emailExists(email) === email) {
      req.flash("error", "email already registered");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await saveUser(name, email, hashedPassword);
    req.flash("sucess", "user succesfully registered")
    res.redirect("/register");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/register");
  }
};

// Display all registered users.

const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];
    try {
        users = await getAllUsers();
    } catch (error) {
        req.flash("error", error)
    }
    res.render("forms/registration/list", {
        title: "Registered Users",
        users: users
    })
};
// GET / register - Display the registration form
router.get("/", showRegistrationForm)
// POST /register - Handle registration form submission with validation
router.post("/", registrationValidation, processRegistration);
// GET /register/list - Display all registered users
router.get("/list", showAllUsers);

export default router;