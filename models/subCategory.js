let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let subCategory = new Schema({

    category: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subCategory_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('subCategory', subCategory);
