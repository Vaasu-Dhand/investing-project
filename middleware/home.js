const htmlToText = require("html-to-text");
const commaNumber = require("comma-number");

const Companies = require("../models/Companies");

module.exports = {
  getHomeData: async (req, res, next) => {
    // Queries
    const information =
      "name number_of_employees ipo overview tag_list total_money_raised";
    const getFacebook = await Companies.findOne(
      { name: "Facebook" },
      information
    ).exec();
    const getApple = await Companies.findOne(
      { name: "Apple" },
      information
    ).exec();
    const getTwitter = await Companies.findOne(
      { name: "Twitter" },
      information
    ).exec();
    const getStarbucks = await Companies.findOne(
      { name: "Starbucks" },
      information
    ).exec();

    // Converting Doc to Object { Check if there;'s a way to get objects instead of documents in queries }
      const facebook = getFacebook.toObject();
      const apple = getApple.toObject();
      const twitter = getTwitter.toObject();
      const starbucks = getStarbucks.toObject();
      
    // Custom Operations
    let companies = new Array(facebook, apple, twitter, starbucks);
    companies.forEach((company) => {
      // Remove HTML from Overview using htmlToText
      company.overview = htmlToText.fromString(company.overview, {
        ignoreHref: true,
      });
      // Converting tag_list String to Array
      company.tag_list = company.tag_list.split(", ");
      // Coverting number_of_employees and valuation_amount to comma format
      company.number_of_employees = commaNumber(company.number_of_employees);
      company.ipo.valuation_amount = commaNumber(company.ipo.valuation_amount);
      // Converting total_money_raised String to Number format
      // Billions
      if (company.total_money_raised.includes("B")) {
        company.total_money_raised = company.total_money_raised.replace(
          /[^\d.-]/g,
          ""
        );
        company.total_money_raised *= 1000000000;
        company.total_money_raised = commaNumber(company.total_money_raised);
      }
      // Millions
      if (company.total_money_raised.includes("M")) {
        company.total_money_raised = company.total_money_raised.replace(
          /[^\d.-]/g,
          ""
        );
        company.total_money_raised *= 1000000;
        company.total_money_raised = commaNumber(company.total_money_raised);
      }
      // Grands
      if (company.total_money_raised.includes("k")) {
        company.total_money_raised = company.total_money_raised.replace(
          /[^\d.-]/g,
          ""
        );
        company.total_money_raised *= 1000;
        company.total_money_raised = commaNumber(company.total_money_raised);
      }
    });

    req.homeData = { facebook, apple, twitter, starbucks };
    next();
  },
  numbersAnimation: (req, res, next) => {
    
  },
};
