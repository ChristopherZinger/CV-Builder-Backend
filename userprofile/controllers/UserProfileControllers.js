const jwt = require('jsonwebtoken');
const { UserProfileModel } = require('../models/UserProfileModels');


module.exports.saveProfile = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user already has a profile model
        const userProfile = await UserProfileModel.findOne({ user: res.user._id })

        if (!userProfile) {
            // save new model
            const newUserProfile = new UserProfileModel({
                user: res.user._id,
                ...req.body
            })
            await newUserProfile.save();
            res.status(201);
        } else {
            if (!req.body.contact) {
                // update model
                const updatedProfile = await UserProfileModel.findOneAndUpdate(
                    { user: res.user._id },
                    req.body
                )
                await updatedProfile.save();
            } else {
                // append new contact
                const updatedProfile = await UserProfileModel.findOne({ user: res.user._id });
                updatedProfile.contact.push(req.body.contact)
                await updatedProfile.save();
            }

            res.status(200);
        }

        // create data object to send back to client
        const { info, contact, address } = await UserProfileModel.findOne({ user: res.user._id })
        const sendData = {
            info,
            contact,
            address
        }

        return res.json(sendData)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

module.exports.getProfile = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user already has a profile model
        const userProfile = await UserProfileModel.findOne({ user: res.user._id })

        // user profile is missing
        if (!userProfile) return res.sendStatus(404);

        // create data object to send back to client
        const { info, contact, address } = userProfile;

        const sendData = {
            info,
            contact: [{ type: 'email', value: res.user.email }, ...contact],
            address
        }

        return res.json(sendData)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.removeContact = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized
    const id = req.query.id;
    try {
        const userProfile = await UserProfileModel.findOneAndUpdate(
            { user: res.user._id },
            { $pull: { "contact": { _id: id } } })

        await userProfile.save();
        const newUserProfile = await UserProfileModel.findOne({ user: res.user._id })
        res.status(200).json(newUserProfile)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}