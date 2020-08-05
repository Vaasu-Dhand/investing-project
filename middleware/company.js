const htmlToText = require("html-to-text");

const mongoose = require('mongoose')
const Companies = require("../models/Companies");

module.exports = {
  getCompanyData: async (req, res, next) => {
    try {
      // Queries
        const information = "name ipo founded_day founded_month founded_year description overview relationships";
        // const id = mongoose.Types.ObjectId(req.params.id);
        console.log(req.params.id);
        // const getCompanyData = await Companies.findById(req.params.id);
        // const getCompanyData = await Companies.findById((req.params.id), 'name').exec();

        // console.log(getCompanyData);   
        console.log('Print This');   
        // Coverting Mongoose Document to Object
        // const companyData = getCompanyData.toObject()
        // console.log(companyData); 
  
        // Remove HTML from Overview using htmlToText
        // companyData.overview = htmlToText.fromString(companyData.overview, {
        //   ignoreHref: true,
        // });
  
        // Picking first 4 Execitives from Relationships Array
        // companyData.relationships.length = 4; 
  
        // req.companyData = companyData
    } catch (error) {
      console.error('Error: ' +  error)
    }
    next();  
  }
}