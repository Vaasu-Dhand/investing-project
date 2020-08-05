const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars')
const Companies = require('../models/Companies')
const Company = require('../models/Company')
const { getHomeData, numbersAnimation } = require('../middleware/home')
const { getCompanyData } = require('../middleware/company');

// Homepage Route
router.get('/', getHomeData, (req, res) => {
  res.render('home', {
    facebook: req.homeData.facebook,
    apple: req.homeData.apple,
    twitter: req.homeData.twitter,
    starbucks: req.homeData.starbucks,
  }) 
});

// List Route
router.get('/list', (req, res) => {
  res.render('list')
});

// Register Route
router.route('/register')
  .get((req, res) => res.render('register'))
  .post(async (req, res) => {
    try {
    console.log(req.body);
    const newCompany = new Company({
      name: req.body.title,
      email: req.body.email,
      telephone: req.body.telephone,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      province: req.body.province,
      zip: req.body.zip,
      date: req.body.date
    });
      const company = await newCompany.save()
      res.send(company)
    } catch (error) {
      // console.log(error);
      res.status(400).send(error)
    }
})

// Company Route
router.get('/list/:id', getCompanyData, (req, res) => {
  res.render('company', {
    comapany: req.companyData
  });
})

module.exports = router;