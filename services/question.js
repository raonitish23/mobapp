const Question = require('../models/questions');
const path = require('path')
const fs = require('fs');
var multer = require('multer')
const Uuid = require('uuid')
const short = require('short-uuid');

const createQuestion = async (req, res, next) => {
    try {

        let {
            questionText,
            category,
            category_id,
            subCategory,
            subCategory_id,
            options,
            multipleAnswers
        } = req.body

        if (category === undefined || category === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'category is required',
                'field': 'category'
            });
        }
        if (category_id === undefined || category_id === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Category id is required',
                'field': 'category_id'
            });
        }
        if (subCategory === undefined || subCategory === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Sub Category is required',
                'field': 'subCategory'
            });
        }
        if (subCategory_id === undefined || subCategory_id === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'subCategory_id is required',
                'field': 'subCategory_id'
            });
        }
        if (questionText === undefined || questionText === undefined) {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Question Text is required',
                'field': 'questionText'
            });
        }
        if (options === undefined || options === undefined) {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'options is required',
                'field': 'options'
            });
        }
        for (let i = 0; i < options.length; i++) {
            options[i].answerId = short.generate()

        }
        const temp = {
            questionText,
            category,
            category_id,
            subCategory,
            subCategory_id,
            questionId: short.generate(),
            options,
            multipleAnswers
        }

        let newQuestion = await Question.create(temp);

        return res.status(201).json({
            'message': 'Question created successfully',
            'data': newQuestion
        });




    } catch (error) {
        console.error("exception" + error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const QuestionList = async (req, res, next) => {
    try {

        const limit = parseInt(req.body.limit);
        const skip = parseInt(req.body.skip);
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

        if (limit === undefined || limit === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Limit is required',
                'field': 'limit',
                "status": false
            });
        }

        if (skip === undefined || skip === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Skip is required',
                'field': 'skip',
                "status": false
            });
        }
        let Question_data = await Question.find({}).skip(skip).limit(limit);
        let total_Question = await Question.find({}).countDocuments();

        return res.status(200).json({
            'message': 'Question fetched successfully',
            "status": true,
            "data": Question_data,
            "total_Question": total_Question
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            "status": true,
            'description': 'something went wrong, Please try again',
            "error": error
        });
    }
}

const deleteQuestion = async (req, res, next) => {
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

        let delete_Question = await Question.deleteOne({ _id: Id });



        return res.status(200).json({
            'message': 'Question deleted successfully'
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const answerQuestion = async (req, res, next) => {
    try {

        let {
            questionId,
            answerId,
            uid
        } = req.body

        if (questionId === undefined || questionId === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Question Id is required',
                'field': 'questionId'
            });
        }
        if (uid === undefined || uid === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'Uid is required',
                'field': 'uid'
            });
        }

        let checkAnswer = await Question.findOne({ questionId: questionId });
        let answerStatus = false
        for (let i = 0; i < checkAnswer.options.length; i++) {
            let checkAnswerId = checkAnswer.options[i].answerId;
            let status = checkAnswer.options[i].status;

            if (status === true) {
                if (checkAnswerId === answerId) {
                    answerStatus = true
                }
            }
        }
        console.log(answerStatus)

        return res.status(200).json({
            'message': 'Answer marked successfully',
            "status": true
        });


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            "status": false,
            "error": error,
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {
    createQuestion: createQuestion,
    QuestionList: QuestionList,
    deleteQuestion: deleteQuestion,
    answerQuestion: answerQuestion
}