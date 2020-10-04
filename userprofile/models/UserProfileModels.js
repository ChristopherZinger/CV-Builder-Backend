const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create UserProfile Model
let UserProfile = new Schema({
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "userProfile",
        required: [true, "AUTH_MODEL_MISSING"]
    },
    info: {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        birthdate: {
            type: Date
        },
    },
    address: {
        city: {
            type: String,
        },
        street: {
            type: String,
        },
        number: {
            type: Number,
        },
    },
    contact: {
        phone: {
            type: String,
        },
        links: [{
            type: String,
        }]
    }
})

const UserProfileModel = mongoose.model("UserProfile", UserProfile);

// export models
module.exports.UserProfileModel = UserProfileModel;