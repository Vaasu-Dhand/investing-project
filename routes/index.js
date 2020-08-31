const express = require("express");
const router = express.Router();
const Companies = require("../models/Companies");
const Company = require("../models/Company");
const { getHomeData, numbersAnimation } = require("../middleware/home");
const { addImagesToDb, getCompanyData } = require("../middleware/company");
const { validateCompany } = require("../middleware/register");
const { getListData, paginator } = require('../middleware/list')
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
router.get("/list/:id", addImagesToDb, getCompanyData, (req, res) => {
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
      // console.log(req.body);
      const newCompany = new Company({
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        province: req.body.province,
        zip: req.body.zip,
        date: req.body.date,
      });
      // const company = await newCompany.save()
      // res.send(newCompany);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

// 404 Page
router.use((req, res, next) => {
  res.status(404).render("404")
})


module.exports = router;
