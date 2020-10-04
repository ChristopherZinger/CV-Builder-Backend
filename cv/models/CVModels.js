const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Experience Model
let CV = new Schema({
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "education",
        required: [true, "AUTH_MODEL_MISSING"]
    },
    info: [{
        type: String,
    }],
    address: [{
        type: String,
    }],
    contact: [{
        type: String,
    }],
    education: [{
        type: Schema.Types.ObjectId,
        ref: "education",
    }],
    experience: [{
        type: Schema.Types.ObjectId,
        ref: "experience",
    }]
})

const CVModel = mongoose.model("CV", CV);

// export models
module.exports.CVModel = CVModel;