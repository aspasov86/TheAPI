const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
    try {
        const user = await User.find({ email: req.body.email})
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    const newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    try {
                        const result = await newUser.save();
                        console.log(result);
                        res.status(201).json({
                            message: "User Created!"
                        });
                    }
                    catch(err) {
                        console.log(err)
                        res.status(500).json({ error: err });
                    }
                }   
            });
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.find({ email: req.body.email });
        if (user.length < 1) {
            return res.status(401).json({ message: "Auth failed" });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: "Auth failed" });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].password,
                        userId: user[0]._id
                    },
                    "autobus",
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: "Auth successful",
                        token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            });
        }
    } 
    catch(err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {
        const result = await User.remove({ _id: req.params.userId });
        console.log(result);
        res.status(200).json({
            message: 'User deleted!'
        });
    }
    catch(err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
});

module.exports = router;