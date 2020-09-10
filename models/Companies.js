const mongoose = require("mongoose");

// Create a Schema
const companiesSchema = new mongoose.Schema({}, { strict: false });

// ? Converts Mongoose Doucuments into a JavaScript object at Schema Level.
companiesSchema.set('toObject', { getters: true });  // ! Not Working (Read Mongoose Docs)

const Companies = mongoose.model("Companies", companiesSchema, "companies");

module.exports = Companies; 