const htmlToText = require("html-to-text");
const axios = require("axios").default;

const Companies = require("../models/Companies");

module.exports = {
  companyExists: async (req, res, next) => {
    try {
      const companyExists = await Companies.findById(req.params.id).exec(); 
      next()
    } catch (error) { // If error occurs
      console.log(`Error: Cannot find company with id: "${error.value}"`);
      next('route');
    }
  },
  addImagesToDb: async (req, res, next) => {
    try {
      const getCompany = await Companies.findById(req.params.id).exec(); 
      if (getCompany.get("images") === undefined) { 
        // Company dosen't have an images added
        // Get Images
        const imagesData = await axios.get(
          "https://randomuser.me/api/?results=4&gender=male"
        );
        const images = []; 
        imagesData.data.results.forEach((result) => {
          images.push(result.picture.large);
        });

        // Update Company
        const company = await Companies.findByIdAndUpdate(
          req.params.id,
          { images: images },
          { new: true }
        ).exec();
      }
    } catch (error) {
      console.error("Error: " + error);
    }
    next();
  },
  getCompanyData: async (req, res, next) => {
    try {
      // Queries
      const information =
        "name ipo founded_day founded_month founded_year description overview relationships images offices";

      // const id = mongoose.Types.ObjectId(req.params.id);
      const getCompanyData = await Companies.findById(
        req.params.id,
        information
      ).exec();

      // Coverting Mongoose Document to Object
      const companyData = getCompanyData.toObject(); 

      // Remove HTML from Overview using htmlToText
      companyData.overview = htmlToText.fromString(companyData.overview, {
        ignoreHref: true,
      });

      // Cutting the overwiew after 'n' periods
      // console.log(companyData.overview.indexOf('.'))

      // Picking first 4 Execitives from Relationships Array
      if (companyData.relationships && (companyData.relationships.length > 1)) {
        companyData.relationships.length = 4;
      }

      // console.log(companyData.offices);
      req.companyData = companyData;
    } catch (error) {
      console.error("Error: " + error);
    }
    next();
  },
};
