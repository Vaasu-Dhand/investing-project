const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");

require("dotenv").config();

const app = express();

// Middleware
// {Testing Middleware (BEFORE)}
// app.use((req, res, next) => {
//   console.log("before", req.body);
//   next();
// })

// Express Session
app.use(
  session({
    secret: "save",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// {Testing Middleware (AFTER)}
// app.use((req, res, next) => {
//   console.log("after", req.body);
//   next();
// })

// Register Template engine
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    partialsDir: "views/partials",
    helpers: {
      // Register Page
      rememberFields: function (field) {
        // console.log(field);
        return field != "" ? field : "";
      },

      // list Page
      rowBreaker: function (index) {
        if (index % 2 === 0 && index !== 0) {
          // Break Line
          return true;
        } else {
          return false;
        }
      },
      redirectToCategory: function (category) { // Check is not being used
        console.log(globalThis);
        // window.location = `?category=${category}`
      },
      // company page
      addImage: function () {
        const imageSrc = '/images/office_images/office' + (Math.floor(Math.random() * 11)) + '.jpg'
        return imageSrc;
      },
      foundedDate: function (day, month, year) {
        if (day === null || month === null) return year
        else return `${day}/${month}/${year}`
      },
      populateDescription: function (description) {
        if ((description === null) || (description === '')) {
          const names = ['Headquaters', 'North Branch', 'Southern District', 'WhiteHall Office', 'Times Square', 'Crimson Bay', 'Blue Hills']
          return names[Math.floor(Math.random() * 7)]
        } else return description
      },
    }
  })
);
app.set("views", __dirname + "/views"); 

const staticPath = path.join(__dirname, 'public')

app.use(express.static(staticPath)); // Fix for MIME Type Not Supported
console.log(path.join(__dirname, "public"));   
app.set("view engine", "handlebars");

// Routes
app.use("/", require("./routes/index"));

// DB Config (Change This)
const db = process.env.MONGO_URI; 

// Conect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected..."))
  .catch((error) => console.error(error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started at: http://localhost:${PORT}`)
);
