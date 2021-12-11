const express = require('express');
const categoryService = require('../../services/category');
let router = express.Router();

router.post('/create', categoryService.createCategory);
router.post('/list', categoryService.categoryList);
router.post('/delete', categoryService.deleteCategory);



module.exports = router;