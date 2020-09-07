// const newCompany = require("../models/newCompany");
const Companies = require("../models/Companies");
const { camelCase, startCase, template } = require('lodash')

module.exports = {
  checkNewCompany: function (req, res, next) {
    const cookieExists = req.cookies.newCompany;
    if (!cookieExists) {  // GET /register/newCompany
      // QUESTION: I want to redirect to 404 page, in case the user dosen't have the new company cookie, but 404 page does not have a route address.
      res.redirect("/404");
    }
    next();
  },
  saveCompany: async function (req, res, next) {  // POST /register/newCompany
    // Form the data object in a way that /list/:id route can read data from it
    const data = req.body;
    // console.log(data);
    const [ companyName, currentDate ] = JSON.parse(req.cookies.newCompany);
    // Name
    data.name = companyName;
    data.name = startCase(camelCase(data.name)).replace(/ /g, "");
    // Twitter Username
    data.twitter_username = camelCase(data.name);
    // Total Money Raised
    data.total_money_raised = "$0";
    // Date
    const date = currentDate.split('/')
    const [founded_day, founded_month, founded_year] = date
    data.founded_day = parseInt(founded_day)
    data.founded_month = parseInt(founded_month)
    data.founded_year = parseInt(founded_year)
    // Stock Symbol
    data.ipo = { stock_symbol: '' }
    data.stockSymbol = data.stockSymbol.toUpperCase()
    data.ipo.stock_symbol = `${data.stockIndex}: ${data.stockSymbol}`
    delete data.stockIndex
    delete data.stockSymbol
    // Relationships
    data.relationships = [];
    // console.log(data);
    try {
      const company = new Companies(data)
      const savedCompany = await company.save();
      const id = savedCompany._id
      res.redirect(301, `/list/${id}`)
    } catch (error) {
      console.log(error);
    }
    next();
  },
};
