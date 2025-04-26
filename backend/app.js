const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

// Shows HTTP requests in the console
app.use(express.json());

// parse application/x-www-form-urlencoded
// this will allow us to access data from a POST request
app.use(bodyParser.urlencoded({ extended: false }))

// CORS allows requests from any origin (e.g., from the front-end)
app.use(cors());

// Called for GET request at http://localhost:8080/
app.get('/', function (req, res)
{
    console.log('GET / called');
    res.send('<h1>Hello world!</h1>');
})


// Add new route directories here
app.use('/', require('./routes/employees'));

module.exports = app;