const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model, replace with your actual User model
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions', // Assuming you have a Quiz model, replace with your actual Quiz model
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'questions', // Assuming you have a Question model, replace with your actual Question model
                required: true
            },
            selectedOption: {
                type: String, // Assuming your options are represented as strings, adjust based on your model
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }
    ],
    // You can add more fields as needed, such as timestamp, etc.
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
