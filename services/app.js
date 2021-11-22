const path = require('path')
const fs = require('fs');
const moment = require('moment-timezone');
var multer = require('multer')
const MailChecker = require('mailchecker');
const User = require('../models/user');
var passwordValidator = require('password-validator');
const Uuid = require('uuid')
var schema = new passwordValidator();
const utils = require('../utility/util')

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);

const createUser = async (req, res, next) => {
    try {

        let {
            uid
        } = req.body



        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'uid required',
                'field': 'uid',
                "status": false
            });
        }


        const temp = {
            uid
        }
        let user_data = await User.find({ uid: uid }).countDocuments()

        if (user_data > 0) {
            return res.status(404).json({
                'description': 'Uid is already registered',
                "status": false
            });
        }
        let newUser = await User.create(temp);

        return res.status(201).json({
            'message': 'new User created successfully',
            'data': newUser,
            "status": true
        });


    } catch (error) {
        console.error("exception" + error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again',
            "status": false
        });
    }
}

const userLogin = async (req, res, next) => {

    try {

        let {
            uid
        } = req.body;

        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Uid is required',
                'field': 'uid',
                "status": false
            });
        }


        let user_data = await User.findOne({ uid: uid })

        if (user_data === undefined || user_data === '' || user_data === null) {
            return res.status(404).json({
                'description': 'User is not registered',
                "status": false
            });
        }

        return res.status(200).json({
            'message': 'Login successfully',
            "status": true

        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again',
            "status": false
        });
    }
}

const forgotPassword = async (req, res, next) => {

    try {

        let {
            user_email
        } = req.body

        if (user_email === undefined || user_email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'user Email is required',
                'field': 'user_email'
            });
        }
        if (!MailChecker.isValid(user_email)) {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'user email is InValid',
                'field': 'user_email'
            });
        }
        user_email = user_email.toLowerCase();


        user_email = user_email.trim()

        let User_data = await User.find({
            user_email: user_email,
        })
        if (User_data.length === 0) {
            return res.status(404).json({
                'description': 'User email is not registered',
            });
        }


        var randomPassword = utils.getGeneratePassword()
        var password_has = utils.getBcryptPassword(randomPassword)

        // update password
        var User_id = User_data[0]._id
        let update_password_user = await User.findByIdAndUpdate({
            _id: User_id,
        }, {
            $set: {
                password: password_has,
            },
        })

        return res.status(200).json({
            'message': 'Password sent on mail successfully',
            "randomPassword": randomPassword
        });
        //TODO check for smtp support
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const updatePassword = async (req, res, next) => {
    try {

        let {
            newPassword,
            user_email
        } = req.body



        if (newPassword === undefined || newPassword === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'New Password is required',
                'field': 'newPassword'
            });
        }

        if (user_email === undefined || user_email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'user email is required',
                'field': 'user_email'
            });
        }

        let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

        if (!regex.test(newPassword)) {
            return res.status(404).json({
                status: false,
                description: 'Password with at least a symbol, upper and lower case letters and a number and of at least 8 digits',
            })
        }

        user_email = user_email.toLowerCase();
        user_email = user_email.trim()

        let User_data = await User.find({
            user_email: user_email,
        })
        if (User_data.length === 0) {
            return res.status(404).json({
                'description': 'Uid is not registered',
            });
        }

        var password_has = utils.getBcryptPassword(newPassword)
        // update password
        var User_id = User_data[0]._id
        let update_password_User = await User.findByIdAndUpdate({
            _id: User_id,
        }, {
            $set: {
                password: password_has,
                password_updated: true
            },
        })

        return res.status(200).json({
            'message': 'Password updated successfully'
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const updateSignupUser = async (req, res, next) => {
    try {

        let {
            name,
            age,
            gender,
            motivates,
            uid
        } = req.body



        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Name is required',
                'field': 'name',
                "status": false
            });
        }
        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'U id is required',
                'field': 'uid',
                "status": false
            });
        }

        if (age === undefined || age === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'user email is required',
                'field': 'user_email',
                "status": false
            });
        }

        if (gender === undefined || gender === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Gender is required',
                'field': 'gender',
                "status": false
            });
        }

        if (motivates === undefined || motivates === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Motivates is required',
                'field': 'motivates',
                "status": false
            });
        }
        gender = gender.toUpperCase();

        let User_data = await User.find({
            uid: uid,
        })
        if (User_data.length === 0) {
            return res.status(404).json({
                'description': 'Uid is not registered',
                "status": false
            });
        }

        let update_profile = await User.updateOne({
            uid: uid,
        }, {
            $set: {
                name,
                age,
                gender,
                motivates
            },
        })

        return res.status(200).json({
            'message': 'Profile updated successfully',
            "status": true
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again',
            "status": false
        });
    }
}

const getUserProfile = async (req, res, next) => {
    try {

        let {
            uid
        } = req.body
        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'U id is required',
                'field': 'uid',
                "status": false
            });
        }

        let User_data = await User.findOne({
            uid: uid,
        })
        if (User_data) {
            return res.status(200).json({
                'message': 'Profile fetched successfully',
                "status": true,
                "data":User_data
            });
        }

        return res.status(404).json({
            'description': 'Uid is not registered',
            "status": false
        });



    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again',
            "status": false
        });
    }
}

module.exports = {
    createUser,
    userLogin,
    forgotPassword,
    updatePassword,
    updateSignupUser,
    getUserProfile
}