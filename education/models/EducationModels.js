const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Experience Model
let Education = new Schema({
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "education",
        required: [true, "AUTH_MODEL_MISSING"]
    },
    school: {
        type: String,
        required: [true, "SCHOOL_MISSING"]
    },
    title: {
        type: String,
        required: [true, "TITLE_MISSING"]
    },
    course: {
        type: String,
        required: [true, "COURSE_MISSING"]
    },
    startDate: {
        type: Date,
        required: [true, "START_DATE_MISSING"]
    },
    endDate: {
        type: Date
    }
})

const EducationModel = mongoose.model("Education", Education);

// export models
module.exports.EducationModel = EducationModel;