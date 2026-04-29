// Import express using ESM syntax
import express from 'express';

// Create an instance of an express application
const app = express();

const name = process.env.NAME;

// Define a route handler for the root URL ('/')
app.get('/', (req,res)=> {
    res.send(`Hellow guys! ${name}, welcome to my server!`);
});


//  Define the port number the server will listen on
const PORT = 3000;

// Start the server and listen on the defined port
app.listen(PORT, () =>{
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
})