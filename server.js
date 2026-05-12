// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Cpurse data
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

// app = express() creates an instance for the application 
const app = express();
app.set('view engine', 'ejs'); // set the view engine to ejs


// below important variable section
const NODE_ENV = process.env.NODE_ENV || "production"; // set the environment from .env file or default to development
const PORT = process.env.PORT || 3000; // set the port from .env file or default to 3000
const name = process.env.NAME || "Guest";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))
app.set("views", path.join(__dirname, "src/views")); // Tell Express where to find your templates

// Define a route handler for the root URL ('/') HERE WE DECLARED ROUTES
app.get('/', (req,res)=> {
    const title = "Home page";
    const name = "Laurin Vasquez";
    res.render('home', { title, name });
});

app.get('/about', (req, res) => {
    const title = "About me";
    const name = "Laurin Vasquez";
    res.render('about', { title, name });
});

app.get('/products', (req, res) => {
    const title = "Products";
    res.render('products', { title });
});

app.get("/catalog", (req, res) => {
    res.render('catalog',{
        title: "Course Catalog",
        courses: courses
    })
})

app.get("/catalog/:courseId", (req, res, next) => {
    // Extract the ID from the URL
    const courseId = req.params.courseId;

    // Lool up the course in our data
    const course = courses[courseId]

    if (!course) {
        // error handler, if there is not ID in our database send it right through the middleware error handler
        const err = new Error(`Course ${courseId} not Found`);
        err.status = 404;
        return next(err);
    }
    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || "time";

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    //  Sort based on the parameter
    switch(sortBy) {
        case "profesor":
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case "room":
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case "time":
            default:
                // keep original time order as default
                break
    }
    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-details', {
        title: `${courseId} - ${course.title}`,
        course: {...course, sections: sortedSections},
        currentSort: sortBy
    });
});

// app.get('/products/:id', (req, res) => {
//     const userId = req.params.id;
//     // Validate that the ID is numeric
//     if (!/^\d+$/.test(userId)) {
//         return res.status(400).send('Invalid user ID. Must be a number.');
//     }
//     // Convert string to number for use in application logic
//     const numericUserId = parseInt(userId, 10);
//     res.send(`You requested information for user ID: ${numericUserId}`);
// });


// Global error handling middleware for 404 and other errors
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// Global error handling for 404s and 500s
app.use((err, req, res, next) => {
    // Prevent infinite loop if headers are already sent
    if (res.headerSent || res.finished) {
        return next(err);
    }
    // Determine the states code and template
    const status = err.status || 500;
    const message = status === 404 ? "404": "500";
    const context = {
        title: status === 404 ? "Page Not Found": "Internal Server Error",
        error: NODE_ENV === "production" ? "An error occured" : err.message, // Show error details only in development
        stack: NODE_ENV === "production" ? null : err.stack,
        NODE_ENV // Our Websocket check needs this and its convenient to pass along
    }
    // Render the appropriate error template with fallback
    try{
        res.status(status).render(`errors/${message}`, context);
    }catch (renderErr) {
        // If rendering fails, send a simple text response
        if (!res.headerSent){
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
    
})

// Start the server and listen on the defined port
app.listen(PORT, () =>{
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
})