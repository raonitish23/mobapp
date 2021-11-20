const appController = require('../../controllers/apis/app');


const express = require('express');
let router = express.Router();
router.use('/app', appController);



module.exports = router;
