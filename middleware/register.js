const Joi = require("joi");

module.exports = {
  validateCompany: async (req, res, next) => {
    // fetch the request data
    const data = req.body;
    // console.log(data);
    companySchema = Joi.object().keys({
      title: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      address1: Joi.string().min(3).max(30).required(),
      address2: Joi.string().min(3).max(30).optional().allow(''),
      city: Joi.string().min(3).required(),
      province: Joi.string().max(2).required(),
      zip: Joi.string().max(7).regex(/^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/).required(),
      date: Joi.date()
    })
    const result = companySchema.validate(data, { abortEarly: false })  // Allows showing multiple errors
    
    const { value, error } = result; // Double Destructuring
    // console.log(value, error);
    const errors = []
    if (error) {
      error.details.forEach(error => { 
        errors.push(error.message)
      });
    }
    // console.log(errors);
    if (errors.length > 0) { // Validation Failed
      res.status(422).render('register', {
        errors, 
        value,
        provinces: ['AB', 'BC', 'MB', 'NB', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],  // Not Being used
      })
    } else {  // Validation Successful
      res.status(200).send('You are In!')
    } 
    next();
  },
};
