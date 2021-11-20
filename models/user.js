let mongoose = require('mongoose');
let Schema = mongoose.Schema;



let User = new Schema({
  user_email: {
    type: String,
  },
  name: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    default: "Not Updated"
  },
  password: {
    type: String
  },
  education: {
    type: String,
  },
  goals: {
    type: String,
  },
  languages: {
    type: String,
  },
  work: {
    type: String,
  },
  industry: {
    type: String,
  },
  marital_status: {
    type: String,
  },
  children: {
    type: String,
  },
  political_preference: {
    type: String,
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('User', User);
