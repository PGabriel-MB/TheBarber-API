const express = require('express');
const router = express.Router();

const authMiddlware = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const Address = require('../models/Address');


router.use(authMiddlware);

router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    const user = 
        await User.findOne({ _id })
            .select(['-services', '-comments', '-stars']);

    res.send({ user });
});

router.patch('/:userId', async (req, res) => {
    /**
     *  It does the user update
     */
    try {
        const _id = req.params.userId;

        await User.findOneAndUpdate(
            { _id },
            { ...req.body, updated: new Date() },
            { runValidators: true }
        );

        const user_updated = await User.findOne({ _id });
     
        res.send({ user_updated });
    } catch (err) {
        return res.status(400).send({ error: 'Request failed!', err })
    }
});

module.exports = app => app.use('/users', router);