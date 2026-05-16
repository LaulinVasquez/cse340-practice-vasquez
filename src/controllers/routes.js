import { Router } from "express";

//  Create a new router instance
const router = Router();

// TODO: Add import statements for controllers and middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
// TODO: Add route definitions

// Home and Basics
router.get('/', homePage);
router.get('/about', aboutPage);

// Catalog and course detail
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// Demo page
router.get('/demo', addDemoHeaders, demoPage);

// Router to trigger error
router.get('/test-error', testErrorPage);

export default router