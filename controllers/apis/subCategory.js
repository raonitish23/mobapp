const express = require('express');
const subCategoryService = require('../../services/subCategory');
let router = express.Router();

router.post('/create', subCategoryService.createSubCategory);
router.post('/list', subCategoryService.subCategoryList);
router.post('/delete', subCategoryService.deleteSubCategory);



module.exports = router;