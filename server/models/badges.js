const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true 
    },
    condition:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('badge' , BadgeSchema);