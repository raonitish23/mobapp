const express = require('express');
const appService = require('../../services/app');
let router = express.Router();

router.post('/create-user', appService.createUser);
router.post('/user-login', appService.userLogin);

router.post('/update-password', appService.updatePassword);
router.post('/forgot-password', appService.forgotPassword);
router.get('/test', appService.forgotPassword);
router.post('/update-signup-user', appService.updateSignupUser);
router.post('/get-user-profile', appService.getUserProfile);
router.get("/download/:file(*)",appService.download)

module.exports = router;