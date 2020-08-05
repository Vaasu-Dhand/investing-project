const mongoose = require('mongoose')

// name ipo founded_day founded_month founded_year description overview relationships

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  telephone: {
    type: Number,
    required: true,
    min: 10
  },
  address1: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  address2: {
    type: String,
    required: false,
    min: 3,
    max: 255
  },
  city: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  province: {
    type: String,
    required: true,
    min: 2,
  },
  zip: {
    type: String,
    required: true,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now
  },
  ipo: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  overview: {
    type: String,
    required: false
  },
  relationships: {
    type: Array,
    required: false
  }
})

module.exports = mongoose.model('Company', companySchema, "companies")