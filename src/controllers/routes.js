import { Router } from "express";

//  Create a new router instance
const router = Router();

// TODO: Add import statements for controllers and middleware
import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";
// TODO: Add route definitions
router.use("/", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/main.css">');
  next();
});
router.use("/catalog/list", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/main.css">');
  next();
});
router.use("/about", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/main.css">');
  next();
});
router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/main.css">');
  next();
});

// Home and Basics
router.get("/", homePage);
router.get("/about", aboutPage);

// Catalog and course detail
router.get("/catalog/list", catalogPage);
router.get("/catalog/:slugId", courseDetailPage);

// Demo page
router.get("/demo", addDemoHeaders, demoPage);

// Faculty page
router.get("/faculty", facultyListPage);
router.get("/faculty/:facultySlug", facultyDetailPage);

// Router to trigger error
router.get("/test-error", testErrorPage);

export default router;
