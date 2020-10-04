const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/AuthModels');



// GLOBAL VARIABLE
const expirationPeriod = 1; // in minutes


function handleErrors(err) {
    console.log('[AuthController.js] handleErrors : ', err.message, err.code);
    let errors = { email: '', password: '', code: null };

    // incorrect email -> errors in User.login
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
        errors.code = 400;
        return errors;
    }

    // incorrect password -> errors in User.login
    if (err.message === 'INVALID_PASSWORD') {
        errors.password = 'Incorrect password';
        errors.code = 401;
        return errors;
    }

    // duplicate email error
    if (err.message == 'PASSWORD_TOO_SHORT') {
        errors.email = 'This password is too short.';
        errors.code = 400;
        return errors;
    }

    // duplicated email error
    if (err.message == 'EMAIL_REGISTERED' || err.code === 11000) {
        errors.email = 'Sorry, This email is already registered. Try another email';
        errors.code = 409;
        return errors;
    }

    // email not found
    if (err.message == 'EMAIL_NOT_FOUND') {
        errors.email = 'Cant find this email in database.';
        errors.code = 400;
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        errors.code = 400;
        return errors;
    }

    // else
    errors.code = 500;
    return errors;
}

function generateToken(id, SecretKey, expirationTime) {
    const settings = expirationTime ? { expiresIn: expirationTime + 'm' } : null;
    return jwt.sign(
        { id },
        SecretKey,
        settings,
    )
}

function generateAccessToken(id) {
    return generateToken(id, process.env.ACCESS_TOKEN_SECRET, expirationPeriod)
}

function generateRefreshToken(id) {
    return generateToken(id, process.env.REFRESH_TOKEN_SECRET)
}

async function loginWithTokens(userId, res) {
    // generate set of tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // set cookie for geting new accesstoken
    res.cookie(
        'refreshToken',
        refreshToken,
        {
            httpOnly: true,
            path: '/get-new-access-token'
        }
    )

    return accessToken;
}

module.exports.signup = async (req, res) => {
    const findEmail = req.body.email;
    const password = req.body.password;

    try {
        // check if user already exists
        const user = await UserModel.findOne({ email: findEmail });
        if (user) throw Error('EMAIL_REGISTERED')

        // validate password
        if (password.lenth < 6) throw ('PASSWORD_TOO_SHORT');

        // create new user
        const newUser = await new UserModel({ email: findEmail, password });
        await newUser.save();

        // create access token
        const accessToken = await loginWithTokens(newUser._id, res)

        // user data to return 
        const { email, firstname, lastname } = await UserModel.findOne({ email: findEmail });

        return res.status(201).json({
            accessToken, expirationPeriod, email, firstname, lastname
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}


module.exports.login = async (req, res) => {
    const findEmail = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.login(findEmail, password);

        // create access token
        const accessToken = await loginWithTokens(user._id, res)

        // user data to return 
        const { email, firstname, lastname } = user;

        return res.status(200).json({
            accessToken, expirationPeriod, email, firstname, lastname
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(errors.code).json({ errors });
    }
}


module.exports.logout = (req, res) => {
    res.cookie(
        'refreshToken',
        '',
        {
            httpOnly: true,
            maxAge: 1,
            path: '/get-new-access-token'
        }
    )
    res.sendStatus(200);
}

module.exports.getNewAccessToken = (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {
            if (err) { console.log('[AuthControllers] getNewAccessToken.failed to obtain new access token'); return res.sendStatus(401) }

            const { id } = data;
            if (!id) return res.sendStatus(401);

            const user = await UserModel.findById(id)
            if (!user) return res.sendStatus(401);

            const accessToken = generateAccessToken(user._id);
            res.status(200).json({ accessToken, expirationPeriod })
        }
    )
}