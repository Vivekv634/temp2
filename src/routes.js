const express = require('express')
const router = express.Router()
const Question = require('./models/questions')
const User = require('./models/user')

// get all quiz questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find()
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// get one quiz question
router.get('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const question = await Question.findOne({ _id })
        if (!question) {
            return res.status(404).json({})
        } else {
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// create one quiz question
router.post('/questions', async (req, res) => {
    try {
        const { question, options, correctOption } = req.body

        const newQuestion = await Question.create({
            question, options, correctOption
        })

        return res.status(201).json(newQuestion)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// update one quiz question
router.put('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const { question, options, correctOption } = req.body

        let questionExists = await Question.findOne({ _id })

        if (!questionExists) {
            const newQuestion = await Question.create({
                question, options, correctOption
            })
            return res.status(201).json(newQuestion)
        } else {
            questionExists.question = question
            questionExists.options = options
            questionExists.correctOption = correctOption
            await questionExists.save()
            return res.status(200).json(questionExists)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// delete one quiz question
router.delete('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const question = await Question.deleteOne({ _id })

        if (question.deletedCount === 0) {
            return res.status(404).json()
        } else {
            return res.status(204).json({ question })
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})

router.post('/update-score/:userId', async (req, res) => {
    const userScore = req.body.userScore;
    const _id = req.params.userId;
    const userExists = await User.findOne({ _id });
    if (userExists) {
        userExists.score = userScore;
        userExists.save();
        res.json({user:userExists})
    }
})
// check user's answer against the correct option
router.post('/check-answer/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { selectedOption } = req.body;

        const question = await Question.findOne({ _id: questionId });
        if (!question) {
            return res.status(404).json({ "error": "Question not found" });
        }

        const isCorrect = selectedOption === question.correctOption;

        // You may want to store this information in the user's quiz attempt record
        // or handle it based on your application's logic
        return res.status(200).json({ "isCorrect": isCorrect });
    } catch (error) {
        return res.status(500).json({ "error": error });
    }
});
// get user's quiz score
router.get('/quiz-score/:attemptId', async (req, res) => {
    try {
        const attemptId = req.params.attemptId;

        const quizAttempt = await QuizAttempt.findOne({ _id: attemptId });
        if (!quizAttempt) {
            return res.status(404).json({ "error": "Quiz attempt not found" });
        } else {
            // You may need to customize this based on how your scoring is implemented
            const userScore = calculateUserScore(quizAttempt);
            return res.status(200).json({ "userScore": userScore });
        }
    } catch (error) {
        return res.status(500).json({ "error": error });
    }
});

// Helper function to calculate the user's score
function calculateUserScore(quizAttempt) {
    // Implement your scoring logic based on the quizAttempt data
    // For example, you might iterate through the questions and check the correctness of each answer
    // Calculate the total score and return it
    // This is just a placeholder, you should replace it with your actual scoring logic
    return quizAttempt.answers.reduce((score, answer) => {
        return answer.isCorrect ? score + 1 : score;
    }, 0);
}

module.exports = router