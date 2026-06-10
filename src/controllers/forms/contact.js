import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createContactForm,
  getAllContactForms,
} from "../../models/forms/contact.js";

// start instance
const router = Router();

const showContactForm = (req, res) => {
  res.render("forms/contact/form", {
    title: "Contact Us",
  });
};
/**
 * Handle contact form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, log errors and redirect back to form.
 */

const handleContactSubmission = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //  Log validation errors for developer debugging
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    //  Redirect back to form without saving
    return res.render("./forms/contact/form", {
      title: "Contact Us",
    });
  }

  try {
    // Extract or get validate data
    const { fname, subject, message } = req.body;

    //  Save to database
    await createContactForm(fname, subject, message);
    // console.log("Contact form submitted successfully");
    req.flash("sucess", "Thank you for contacting us! We will respond soon.");
    // Redirect to responses page on success
    res.redirect("/contact/responses");
  } catch (error) {
    console.error("Error saving contact form:", error);
    req.flash("error", "Unable to submit your message. Please try again later.");
    res.redirect("/contact");
  }
};

// Display all contact form submissions.
const showContactResponses = async (req, res) => {
  let contactForms = [];
  try {
    contactForms = await getAllContactForms();
  } catch (error) {
    // console.error('Error retriving contact forms:', error);
    req.flash("error", error);
  }
  res.render("forms/contact/responses", {
    title: "Contact Form Submissions",
    contactForms,
  });
};

// GET /contact - Display the contact form

router.get("/", showContactForm);

//  POST / contact -  Handle contact form submission with validation
router.post(
  "/",
  [
    body("fname")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("name most be at least 2 characters!!")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores",
      ),
    body("subject")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Subject most be at least 2 characters!!"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message most be at least 10 characters"),
  ],
  handleContactSubmission,
);

// GET / contact/responses - Display all contact form submissions

router.get("/responses", showContactResponses);

export default router;
