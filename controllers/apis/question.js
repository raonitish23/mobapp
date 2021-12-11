const express = require('express');
const questionService = require('../../services/question');
let router = express.Router();

router.post('/create', questionService.createQuestion);
router.post('/list', questionService.QuestionList);
router.post('/delete', questionService.deleteQuestion);
router.post('/answer', questionService.answerQuestion);



module.exports = router;