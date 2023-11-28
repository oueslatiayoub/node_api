// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const AnswerSchema = new Schema({
//     text: {
//         type: String,
//         required: true
//     },
//     isCorrect: {
//         type: Boolean,
//         required: true
//     }
// });

// const QuestionSchema = new Schema({
//     questionText: {
//         type: String,
//         required: true
//     },
//     answers: [AnswerSchema]
// });

// const QuizSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     nbr_questions: {
//         type: Number,
//         required: true
//     },
//     time: {
//         type: Number,
//         required: true,
//     },
//     formation_id: {
//         type: String,
//         required: true
//     },
//     questions: [QuestionSchema]  // Embedding questions within the quiz
// });

// module.exports = mongoose.model('quiz', QuizSchema);


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    answers: [AnswerSchema],
    correctAnswer: [AnswerSchema]  // Change this line
});


const QuizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nbr_questions: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    formation_id: {
        type: String,
        required: true
    },
    questions: [QuestionSchema]  // Embedding questions within the quiz
});

module.exports = mongoose.model('quiz', QuizSchema);