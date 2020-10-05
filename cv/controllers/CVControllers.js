const jwt = require('jsonwebtoken');
const { CVModel } = require('../models/CVModels');


module.exports.saveCV = async (req, res) => {
}


module.exports.getCVList = async (req, res) => {
    // check for user
    if (!res.user) return res.sendStatus(401) // not authorized

    try {
        // check if user has a education model
        const cvList = await CVModel.find({ user: res.user._id });
        return res.status(200).json(cvList);

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


module.exports.removeCV = async (req, res) => {
}

