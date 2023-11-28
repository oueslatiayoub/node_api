const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CertifSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true 
    },
    imageUrl:{
        type: String,
        required: true,
    },
    neededQuizzes:{
        type: Array,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('certification' , CertifSchema);