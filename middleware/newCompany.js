const Companies = require("../models/Companies");
const { camelCase, startCase } = require('lodash')

module.exports = {
  checkNewCompany: function (req, res, next) {
    const cookieExists = req.cookies.newCompany;
    if (!cookieExists) {  // GET /register/newCompany
      const error = new Error('Cookie Not Found')
      // ? I want to redirect to 404 page, in case the user dosen't have the new company cookie, but 404 page does not have a route address.
      res.redirect("/404");
      return next(error)
    }
    // * console.log('Logs This if the next(error) isn"t retruned');
    next();
  },
  saveCompany: async function (req, res, next) {  // POST /register/newCompany 
    const data = req.body;
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
