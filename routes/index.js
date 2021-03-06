/* eslint-disable camelcase */
require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bcrypt = require('bcryptjs');
const accountController = require('../controllers/account');
const applicationController = require('../controllers/application');
const eventController = require('../controllers/event');
const mail = require('../controllers/mail');
const jobs = require('../controllers/jobs');
// const utils = require('../utils/index');
const { account } = require('../models');


const jwtMW = exjwt({
    secret: process.env.JWT_PRIVATE_KEY,
});

const router = express.Router();

router.post('/api/token', asyncHandler(async (req, res, next) => {
    const { username, password, grant_type } = req.body;
    if (grant_type === 'password') {
        try {
            const findAccount = await account.findOne({ where: { username } });
            if (account !== null) {
                const record = findAccount.dataValues;
                if (bcrypt.compareSync(password, record.password)) {
                    const payload = {
                        id: record.id,
                    };
                    const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
                    res.status(200).send(`{ "access_token": "${token}" }`);
                    next();
                } else {
                    res.status(400).send('{"error": "invalid_grant"}');
                    next();
                }
            } else {
                res.status(400).send('{"error": "invalid_grant"}');
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send('{ "error": "unsupported_grant_type" }');
        next();
    }
}));

/** ACCOUNT ROUTE */
router.get('/api/accounts', jwtMW, asyncHandler(accountController.get));
router.post('/api/accounts', asyncHandler(accountController.add));
router.patch('/api/accounts/:id', asyncHandler(accountController.update));
router.delete('/api/accounts/:id', asyncHandler(accountController.delete));

/** APPLICATION ROUTE */
router.get('/api/applications', jwtMW, asyncHandler(applicationController.get));
router.get('/api/applications/:id', jwtMW, asyncHandler(applicationController.getById));
router.post('/api/applications', jwtMW, asyncHandler(applicationController.add));
router.patch('/api/applications/:id', jwtMW, asyncHandler(applicationController.update));
router.delete('/api/applications/:id', jwtMW, asyncHandler(applicationController.delete));

/** EVENT ROUTE */
router.get('/api/events', jwtMW, asyncHandler(eventController.get));
router.get('/api/events/:id', jwtMW, asyncHandler(eventController.getById));
router.post('/api/events', jwtMW, asyncHandler(eventController.add));
router.patch('/api/events/:id', jwtMW, asyncHandler(eventController.update));
router.delete('/api/events/:id', jwtMW, asyncHandler(eventController.delete));

/** MAIL */
router.post('/api/send-mail', asyncHandler(mail.send));

/** JOBS */
router.get('/api/jobs', asyncHandler(jobs.get));
router.get('/api/p-jobs', asyncHandler(jobs.getPersonalized));


module.exports = router;
