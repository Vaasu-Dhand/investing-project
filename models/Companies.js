const mongoose = require("mongoose");

// Create a Schema
const companiesSchema = new mongoose.Schema({}, { strict: false });

// Converts Mongoose Doucuments into a JavaScript object at Schema Level.
// CompanySchema.set('toObject', { getters: true });  // Not Working

const Companies = mongoose.model("Companies", companiesSchema, "companies");

module.exports = Companies; 