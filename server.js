// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';


// app = express() creates an instance for the application // below important variable section
const app = express();
const PORT = process.env.PORT || 3000; // set the port from .env file or default to 3000
const name = process.env.NAME || "Guest";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Define a route handler for the root URL ('/') HERE WE DECLARED ROUTES
app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/about.html'));
})

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/products.html'));
})


// Start the server and listen on the defined port
app.listen(PORT, () =>{
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
})