const express = require('express');
const router = express.Router();

const authMiddlware = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const Address = require('../models/Address');


router.use(authMiddlware);

router.get('/', async (req, res) => {
    const serviceProviders = 
        await User
            .find({ serviceProvider: true })
            .select(['-services', '-comments']);

    res.send({ serviceProviders });
});

router.get('/:serviceProviderId', async (req, res) => {
    try {
        
        const _id = req.params.serviceProviderId;

        const serviceProvider = 
            await User
                .findOne({ _id, serviceProvider: true })
                .select(['-services', '-comments']);

        if (!serviceProvider) {
            return res.status(400).send({ error: 'Service Provider not found!' });
        }

        res.send({ serviceProvider });
    } catch (err) {
        return res.status(400).send({error: 'Request failed!', err})
    }
});

module.exports = app => app.use('/serviceProviders', router);