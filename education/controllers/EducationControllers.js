const jwt = require('jsonwebtoken');
const { EducationModel } = require('../models/EducationModels');

module.exports.getEducation = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user has a education model
        const educationList = await EducationModel.find({ user: res.user._id });
        return res.status(200).json(educationList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.saveEducation = async (req, res) => {

    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        const { id, school, title, course, startDate, endDate } = req.body;

        if (!id) {
            // save new model
            console.log('[EducationControllers] save model');
            const newEducation = new EducationModel({
                user: res.user._id,
                school, title, course,
                startDate, endDate
            })
            await newEducation.save();
            res.status(201)
        } else {
            // check if user already has a profile model
            const education = await EducationModel.findById(id)

            if (education) {
                // update model
                console.log('[EducationControllers] update model');
                const updatedEducation = await EducationModel.findOneAndUpdate(
                    { _id: id },
                    req.body
                )
                await updatedEducation.save();
                res.status(200)
            } else {
                return res.sendStatus(400)
            }
        }

        // create data object to send back to client
        const sendData = await EducationModel.find({ user: res.user._id })
        return res.json(sendData)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.removeEducation = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    const eduId = req.query.eduID;

    try {
        // check if user has a experience model
        const x = await EducationModel.findByIdAndRemove(eduId);

        const educationList = await EducationModel.find({ user: res.user._id })
        return res.status(200).json(educationList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

