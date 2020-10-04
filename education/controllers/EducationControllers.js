const jwt = require('jsonwebtoken');
const { EducationModel } = require('../models/EducationModels');

module.exports.getEducation = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user has a experience model
        const educationList = await EducationModel.find({ user: res.user._id });
        return res.status(200).json(educationList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.saveEducation = async (req, res) => {
}


module.exports.removeEducation = async (req, res) => {

}

