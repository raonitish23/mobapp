let mongoose = require('mongoose');
let Schema = mongoose.Schema;



let Category = new Schema({
  category: {
    type: String,
  },
  title: {
    type: String,
  },
  category_id: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  percentage: {
    type: Number,
    default: 10,
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Category', Category);
