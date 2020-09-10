const Joi = require("joi");

module.exports = {
  validateCompany: async (req, res, next) => {
    // fetch the request data
    const data = req.body;
    companySchema = Joi.object().keys({
      title: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      address1: Joi.string().min(3).max(30).required(),
      address2: Joi.string().min(3).max(30).optional().allow(""),
      city: Joi.string().min(3).required(),
      province: Joi.string().max(2).required(),
      zip: Joi.string()
        .max(7)
        .regex(/^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/)
        .required(),
      date: Joi.date(),
    });
    try {
      const result = companySchema.validate(data, { abortEarly: false }); // Allows showing multiple errors

      const { value, error } = result; // Destructuring
      const errors = [];
      if (error) {
        error.details.forEach((error) => {
          errors.push(error.message);
        });
      }
      if (errors.length > 0) { // Validation Failed
        res.status(422).render("register", {
          errors,
          value,
        });
      } else { // 1st Validation Successful

        function getDate() {  // * Declare a snippet or global function in vs code
          const date = new Date();
          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
          const yyyy = date.getFullYear();
          return mm + "/" + dd + "/" + yyyy;
        }
        const currentDate = getDate();

        // Create a cookie (newCompany=companyName&dateCreated)
        const cookieData = JSON.stringify([value.title, currentDate]);
        res.cookie('newCompany', cookieData, { maxAge: 86400000 })
        
        res.redirect(301, "/register/newCompany");
      }
    } catch (error) {
      console.log(error);
    }
    next();
  },
};