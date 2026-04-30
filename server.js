// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { console } from 'inspector/promises';


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

// Start the server and listen on the defined port
app.listen(PORT, () =>{
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
})