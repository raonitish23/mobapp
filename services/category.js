const Category = require('../models/category');
const path = require('path')
const fs = require('fs');
var multer = require('multer')
const Uuid = require('uuid')
const short = require('short-uuid');
const createCategory = async (req, res, next) => {
    try {

        let {
            category, title
        } = req.query

        if (category === undefined || category === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'category is required',
                'field': 'category'
            });
        }

        if (title === undefined || title === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Title is required',
                'field': 'title'
            });
        }

        //Image filter for file upload
        const imageFilter = function (req, file, cb) {
            // Accept images only
            if (!file.originalname.match(/\.(png)$/)) {
                req.fileValidationError = 'Forbidden extension';
                return cb(null, false, req.fileValidationError);
            }
            cb(null, true);
        };
        //Setting up the Directory Structure

        let appDir = path.dirname(require.main.filename);
        let categoryDirectory = '/public/category'
        const CATEGORY_DIR = appDir + '/public/category'


        //Creating folder structure
        fs.mkdirSync(CATEGORY_DIR, {
            recursive: true
        }, err => {
            console.error("Exception could not create folder structure" + err)
            return res.status(422).json({
                'code': 'FILE_UPLOAD_ERROR',
                'description': 'Could Not upload File'
            });
        })
        let imageURL = ""

        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                if (file.fieldname === "photo") {
                    cb(null, CATEGORY_DIR)
                }

            },
            filename: (req, file, cb) => {
                if (file.fieldname === "photo") {
                    let fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
                    cb(null, fileName);
                    imageURL = fileName

                }

            }
        });


        var upload = multer({
            storage: storage,
            // fileFilter: imageFilter
        }).fields(
            [
                {
                    name: 'photo',
                    maxCount: 1
                }
            ]
        );

        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
            } else {
                if (req.file == "undefined") {
                    console.log("No image selected!")
                } else {

                    imageURL = categoryDirectory + "/" + imageURL

                    const temp = {
                        category,
                        title,
                        category_id: short.generate(),
                        imageUrl: imageURL
                    }

                    let newCategory = await Category.create(temp);

                    return res.status(201).json({
                        'message': 'Category created successfully',
                        'data': newCategory
                    });
                }

            }
        })



    } catch (error) {
        console.error("exception" + error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const categoryList = async (req, res, next) => {
    try {



        let {
            uid,
        } = req.body



        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'uid required',
                'field': 'uid',
                "status": false
            });
        }



        let category_data = await Category.find({})

        for (let i = 0; i < category_data.length; i++) {
            let act = category_data[i]

            let diff = 5
            act.percentage = diff
        }

        return res.status(200).json({
            'message': 'agency fetched successfully',
            "data": category_data,

        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const deleteCategory = async (req, res, next) => {
    try {

        let {
            Id
        } = req.body

        if (Id === undefined || Id === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Id is required',
                'field': 'Id'
            });
        }

        let delete_category = await Category.deleteOne({ _id: Id });



        return res.status(200).json({
            'message': 'Category deleted successfully'
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
    createCategory: createCategory,
    categoryList: categoryList,
    deleteCategory: deleteCategory
}