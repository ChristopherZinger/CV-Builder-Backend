const { UserModel } = require('../../auth/models/AuthModels');
const jwt = require('jsonwebtoken');

module.exports.getUser = (req, res, next) => {
    const encodedAccessToken = req.headers.authorization;
    const accessToken = encodedAccessToken.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, accessToken) => {
            if (err) {
                res.user = null;
                next();
            } else {
                try {
                    const user = await UserModel.findById(accessToken.id);
                    res.user = user;
                    next();
                } catch (err) {
                    console.log('[authUtils.js] USER_DOESNT_EXIST')
                    res.user = null;
                    next();
                }
            }
        }
    )
}



