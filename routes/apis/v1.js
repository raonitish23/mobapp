const appController = require('../../controllers/apis/app');
const categoryController = require('../../controllers/apis/category');
const subCategoryController = require('../../controllers/apis/subCategory');
const questionController = require('../../controllers/apis/question');


const express = require('express');
let router = express.Router();
router.use('/app', appController);
router.use('/category', categoryController);
router.use('/sub-category', subCategoryController);
router.use('/question', questionController);



module.exports = router;
