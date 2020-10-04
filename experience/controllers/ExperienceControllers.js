const jwt = require('jsonwebtoken');
const { ExperienceModel } = require('../models/ExperienceModels');


module.exports.saveExperience = async (req, res) => {

    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        const { id, company, position, startDate, endDate } = req.body;

        if (!id) {
            // save new model
            console.log('[ExperienceControllers] save model');
            const newExperience = new ExperienceModel({
                user: res.user._id,
                company, position,
                startDate, endDate
            })
            await newExperience.save();
            res.status(201)
        } else {
            // check if user already has a profile model
            const experience = await ExperienceModel.findById(id)

            if (experience) {
                // update model
                console.log('[ExperienceControllers] update model');
                const updatedExperience = await ExperienceModel.findOneAndUpdate(
                    { _id: id },
                    req.body
                )
                await updatedExperience.save();
                res.status(200)
            }
        }



        // create data object to send back to client
        const sendData = await ExperienceModel.find({ user: res.user._id })
        return res.json(sendData)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.getExperience = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user has a experience model
        const experienceList = await ExperienceModel.find({ user: res.user._id });
        return res.status(200).json(experienceList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.removeExperience = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    const expId = req.query.expID;
    console.log("experience id: ", expId)

    try {
        // check if user has a experience model
        const x = await ExperienceModel.findByIdAndRemove(expId);
        console.log("removed item: ", x)

        const experienceList = await ExperienceModel.find({ user: res.user._id })
        return res.status(200).json(experienceList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

