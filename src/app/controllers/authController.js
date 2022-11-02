const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params , authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async(req, res) => {
    /**
     * User register from mobile
     * @params none
     * 
     * @body {
     *  email: string,
     *  name: string,
     *  password: string
     * }
     */

    const { email } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists!'})

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id })
        });
    } catch (err) {
        return res.status(400).send({ error: "Registration failed", err });
    }
});

router.post('/authenticate', async (req, res) => {
    /**
     * Login route
     * @params none
     * @body {
     *  email: string,
     *  password: string
     * }
     */
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found' });
    
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid Password' });
    
    user.password = undefined;
    
    res.send({
        user,
        token: generateToken({ id: user.id })
    });
})

router.post('/validate-token', async (req, res) => {
    /**
     * Verification route
     * @params
     * @body {
     *  token: string
     * }
     */
    const { token } = req.body;

    await jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            console.error('Error on verifying token', err)
            return res.status(401).send({ error: err.message })
        } 
        
        //req.userId = decoded.id;
        return res.send({ success: "Validated Token!", token })
    })
})

module.exports = app => app.use('/auth', router);