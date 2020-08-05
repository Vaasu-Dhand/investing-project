const express = require("express");
const mongoose = require("mongoose");
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express();

// Middleware
app.use((req, res, next) => {
  console.log("before", req.body);
  next();
})
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  console.log("after", req.body);
  next();
})
app.use(express.static('public'));  // Fix for MIME Type Not Supported 

// Register template engine
app.engine('handlebars', handlebars({    
  defaultLayout: 'main',

  // Custom Helpers
  // helpers: {
  //   stringToArray: function(data) { return data.split(', '); }
  // } 
}))
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

// Routes
app.use('/', require('./routes/index')) 

// DB Config (Change This)
const db = process.env.MONGO_URI; 

// Conect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((error) => console.error(error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT} || http://localhost:${PORT}`));