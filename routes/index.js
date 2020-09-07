const express = require("express");
const router = express.Router();
const Companies = require("../models/Companies");
// const Company = require("../models/Company");
const { getHomeData, numbersAnimation } = require("../middleware/home");
const { companyExists, addImagesToDb, getCompanyData } = require("../middleware/company");
const { validateCompany } = require("../middleware/register");
const { getListData, paginator } = require('../middleware/list')
const { checkNewCompany, saveCompany } = require('../middleware/newCompany'); 

// Homepage Route
router.get("/", getHomeData, (req, res) => {
  res.render("home", {
    facebook: req.homeData.facebook,
    apple: req.homeData.apple,
    twitter: req.homeData.twitter,
    starbucks: req.homeData.starbucks,
  });
});

// List Route
router.get("/list", getListData, paginator,(req, res) => {
    res.render("list", {
      data: req.data,
      pagination: res.locals.paginationHTML
    });
});

// Company Route
router.get("/list/:id", companyExists, addImagesToDb, getCompanyData, (req, res) => {
  res.render("company", {
    company: req.companyData,
  });
});

// Register Route
router
  .route("/register")
  .get((req, res) => res.render("register"))
  .post(validateCompany, async (req, res) => {
    try {
    // console.log(res.locals);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

// New Company Route
router.route("/register/newCompany")
  .get(checkNewCompany, (req, res) => {
    const [ companyName, currentDate ] = JSON.parse(req.cookies.newCompany);
    res.render("newCompany", {
      companyName,
      currentDate
    });
  })
  .post(saveCompany, (req, res) => {
    // Do 2nd validation and save company to db and redirect to /list/:id route
  })

// 404 Page
router.use((req, res, next) => {
  res.status(404).render("404")
})


module.exports = router;
