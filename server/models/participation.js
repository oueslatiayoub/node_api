const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParticipationSchema = new Schema({
    utilisateurId:{
        type: String,
        required: true
    },
    quizName:{
        type: String,
        required: true
    },
    quizId:{
        type: String,
        required: true
    },
    score:{
        type:Number,
        required: true
    },
    passed:{
        type:Boolean,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('participation' , ParticipationSchema);