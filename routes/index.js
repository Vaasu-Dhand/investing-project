const express = require("express");
const router = express.Router();
const { getHomeData } = require("../middleware/home");
const { companyExists, addImagesToDb, getCompanyData } = require("../middleware/company");
const { validateCompany } = require("../middleware/register");
const { getListData, paginator } = require("../middleware/list");
const { checkNewCompany, saveCompany } = require("../middleware/newCompany");

// Homepage Route
router.get("/", getHomeData, (req, res) => {
  try {
    res.render("home", {
      facebook: req.homeData.facebook,
      apple: req.homeData.apple,
      twitter: req.homeData.twitter,
      starbucks: req.homeData.starbucks,
    });
  } catch (error) {
    console.log("Error occured at / : " + error);
  }
});

// List Route
router.get("/list", getListData, paginator, (req, res) => {
  try {
    res.render("list", {
      data: req.data,
      pagination: res.locals.paginationHTML,
    });
  } catch (error) {
    console.log("Error occured at /list : " + error);
  }
});

// Company Route
router.get("/list/:id", companyExists, addImagesToDb, getCompanyData, (req, res) => {
  try {
    res.render("company", {
      company: req.companyData,
    });
  } catch (error) {
    console.log("Error occured at /list/:id : " + error);
    }
  }
);

// Register Route
router
  .route("/register")
  .get((req, res) => res.render("register"))
  .post(validateCompany, async (req, res) => {
    try {
    } catch (error) {
      console.log("Error occured at /register : " + error);
      res.status(400).send(error);
    }
  });

// New Company Route
router
  .route("/register/newCompany")
  .get(checkNewCompany, (req, res, error) => {
    try {
      if (error !== "Cookie Not Found") {
        // Cookie Found
        const [companyName, currentDate] = JSON.parse(req.cookies.newCompany);
        res.render("newCompany", {
          companyName,
          currentDate,
        });
      }
    } catch (error) {
      console.log("Error occured at /register/newCompany : " + error);
    }
  })
  .post(saveCompany, (req, res) => {
    // ? What do I code here if everything is being performed in the Middleware function (saveCompany)
  });

// 404 Page
router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
