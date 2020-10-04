const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');




// Create User Model
let User = new Schema({
    email: {
        type: String,
        required: [true, 'EMAIL_MISSING'],
        unique: [true, 'EMAIL_REGISTERED'],
        validate: [isEmail, 'EMAIL_INVALID']
    },
    password: {
        type: String,
        required: [true, 'PASSWORD_MISSING'],
        unique: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    educationList: [
        {
            type: Schema.Types.ObjectId,
            ref: "EducationList"
        }
    ],
    experienceList: [
        {
            type: Schema.Types.ObjectId,
            ref: "ExperienceList"
        }
    ],
})

// hash the passord before saving
User.pre('save', function (next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

// Login the user
User.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw Error('EMAIL_NOT_FOUND')

    const auth = bcrypt.compareSync(password, user.password);
    if (auth) {
        return user;
    }
    throw Error('INVALID_PASSWORD');

}

const UserModel = mongoose.model("User", User);


// export models
module.exports.UserModel = UserModel;