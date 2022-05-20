const express = require('express');
const router = express.Router();

const authMiddlware = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const Address = require('../models/Address');


router.use(authMiddlware);

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send({ users });
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    res.send({ user });
});

router.get('/address/:userId', async (req, res) => {
    /**
     * Here comes the user id to return all of de Service that he can offer
     */
    const _id = req.params.userId;
    const user = await User.findOne({ _id });
    const address = await Address.find({ _id: user.address });
    user.address = address;
    res.send({ user });
});

router.get('/services/:userId', async (req, res) => {
    /**
     * Here comes the user id to return all of de Service that he can offer
     */
    const _id = req.params.userId;
    const user = await User.findOne({ _id });
    const services = await Service.find({ serviceProvider: _id });

    user.services = services
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