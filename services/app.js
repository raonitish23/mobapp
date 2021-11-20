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
            user_email,
            password
        } = req.body

        if (user_email === undefined || user_email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'user email is required',
                'field': 'user_email'
            });
        }

        if (password === undefined || password === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Password is required',
                'field': 'password'
            });
        }

        user_email = user_email.toLowerCase();
        user_email = user_email.trim()
        password = utils.getBcryptPassword(password)
        const temp = {
            user_email,
            password
        }
        let user_data = await User.find({ user_email: user_email }).countDocuments()

        if (user_data > 0) {
            return res.status(404).json({
                'description': 'User email is already registered',
            });
        }
        let newUser = await User.create(temp);

        return res.status(201).json({
            'message': 'new User created successfully',
            'data': newUser
        });


    } catch (error) {
        console.error("exception" + error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const userLogin = async (req, res, next) => {

    try {

        let {
            password,
            user_email
        } = req.body;

        if (password === undefined || password === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Password is required',
                'field': 'password'
            });
        }

        if (user_email === undefined || user_email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'User Email is required',
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
        let user_data = await User.findOne({ user_email: user_email })

        if (user_data === undefined || user_data === '' || user_data === null) {
            return res.status(404).json({
                'description': 'User Email is not registered',
            });
        }


        if (!utils.comparePassword(password, user_data.password)) {
            return res.status(401).json({
                status: false,
                message: 'Please enter the valid password.',
            })
        }

        return res.status(200).json({
            'message': 'Login successfully',

        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
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
                'description': 'User email is not registered',
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



module.exports = {
    createUser,
    userLogin,
    forgotPassword,
    updatePassword
}