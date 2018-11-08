const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        callback(new Error('invalid mimetype - only image/jpg, image/jpeg and image/png is acceptable'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

const Majstor = require('../models/majstor');

router.get('/', async (req, res, next) => {
    try {
        const majstors = await Majstor.find();
        console.log('majstor', majstors)
        const response = {
            count: majstors.length,
            majstors: majstors.map(majs => {
                return {
                    id: majs._id,
                    firstName: majs.firstName,
                    lastName: majs.lastName,
                    email: majs.email,
                    phoneNumber: majs.phoneNumber,
                    place: majs.place,
                    occupation: majs.occupation,
                    image: majs.image,
                    stats: {
                        brzina: majs.brzina,
                        pedantnost: majs.pedantnost,
                        cena: majs.cena,
                        ljubaznost: majs.ljubaznost
                    }
                }
            })
        };
        res.status(200).json(response);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post('/', checkAuth, upload.single('image'), async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, occupation, place,
    brzina, pedantnost, cena, ljubaznost } = req.body;
    console.log('req', Object.keys(req).sort());
    console.log('req.file', req.file);
    const majstor = new Majstor({
        _id: new mongoose.Types.ObjectId(),
        image: req.file.path,
        firstName, lastName, email, phoneNumber,
        occupation, place, brzina, pedantnost,
        cena, ljubaznost 
    });
    try {
        const result = await majstor.save();
        console.log(result);
        res.status(201).json({
            message: "Majstor addded successfully",
            addedMajstor: majstor
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }

});

router.get('/majstorId', async (req, res, next) => {
    const id = req.params.majstorId;
    try {
        const majstor = Majstor.findById(id)
        console.log(majstor);
        if (majstor) {
            res.status(200).json(majstor);
        } else {
            res.status(404).json({ message: "No valid entry found for provided majstor Id"});
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
});

router.patch('/:majstorId', checkAuth, async (req, res, next) => {
    const id = req.params.majstorId;
    //TODO: adjust this code!!
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    try {
        const result = await Majstor.update({ _id: id }, { $set: updateOps });
        console.log(result);
        res.status(200).json(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:majstorId', checkAuth, async (req, res, next) => {
    const id = req.params.majstorId;
    try {
        const result = Majstor.remove({ _id: id });
        res.status(200).json(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;