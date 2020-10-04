const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Experience Model
let Experience = new Schema({
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "experience",
        required: [true, "AUTH_MODEL_MISSING"]
    },
    position: {
        type: String,
        required: [true, "POSITION_MISSING"]
    },
    company: {
        type: String,
        required: [true, "COMPANY_MISSING"]
    },
    startDate: {
        type: Date,
        required: [true, "START_DATE_MISSING"]
    },
    endDate: {
        type: Date
    }
})

const ExperienceModel = mongoose.model("Experience", Experience);

// export models
module.exports.ExperienceModel = ExperienceModel;