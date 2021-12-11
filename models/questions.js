let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Options = new Schema({
  text: {
    type: String,
    default: "Testing"
  },
  status: {
    type: Boolean,
    enum: [true, false],
    default: false
  },
  answerId: {
    type: String
  }
})

let Question = new Schema({
  category: {
    type: String,
    required: true
  },
  category_id: {
    type: String,
  },
  subCategory: {
    type: String,
    required: true
  },
  subCategory_id: {
    type: String,
    required: true
  },
  questionId: {
    type: String
  },
  questionText: {
    type: String,
    required: true,
  },
  multipleAnswers: {
    type: Boolean,
    required: true,
  },
  options: [Options],
}, {
  timestamps: true
});
module.exports = mongoose.model('Question', Question);
