// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';



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

app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

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