const SubCategory = require('../models/SubCategory');
const path = require('path')
const fs = require('fs');
var multer = require('multer')
const Uuid = require('uuid')
const short = require('short-uuid');
const createSubCategory = async (req, res, next) => {
    try {

        let {
            subCategory,
            category,
            category_id,
            title,
            description
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
        if (subCategory === undefined || subCategory === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'sub Category is required',
                'field': 'subCategory'
            });
        }
        if (category_id === undefined || category_id === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Category id is required',
                'field': 'category_id'
            });
        }
        if (description === undefined || description === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Description is required',
                'field': 'description'
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
        let SubCategoryDirectory = '/public/SubCategory'
        const SubCategory_DIR = appDir + '/public/SubCategory'


        //Creating folder structure
        fs.mkdirSync(SubCategory_DIR, {
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
                    cb(null, SubCategory_DIR)
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

                    imageURL = SubCategoryDirectory + "/" + imageURL

                    const temp = {
                        category,
                        category_id,
                        subCategory,
                        title,
                        description,
                        subCategory_id: short.generate(),
                        imageUrl: imageURL
                    }

                    let newSubCategory = await SubCategory.create(temp);

                    return res.status(201).json({
                        'message': 'SubCategory created successfully',
                        'data': newSubCategory
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

const subCategoryList = async (req, res, next) => {
    try {

        let {
            uid,
            category_id
        } = req.body



        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'uid required',
                'field': 'uid',
                "status": false
            });
        }

        

        let SubCategory_data = await SubCategory.find({category_id})
        let total_SubCategory = await SubCategory.find({}).countDocuments();

        return res.status(200).json({
            'message': 'agency fetched successfully',
            "data": SubCategory_data,
            total_SubCategory: total_SubCategory
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const deleteSubCategory = async (req, res, next) => {
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

        let delete_SubCategory = await SubCategory.deleteOne({ _id: Id });



        return res.status(200).json({
            'message': 'SubCategory deleted successfully'
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
    createSubCategory: createSubCategory,
    subCategoryList: subCategoryList,
    deleteSubCategory: deleteSubCategory
}