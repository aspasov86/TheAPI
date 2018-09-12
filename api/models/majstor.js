const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const MajstorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    place: { type: String, required: true },
    occupation: { type: Number, required: true },
    image: String,
    brzina: Number,
    pedantnost: Number,
    cena: Number,
    ljubaznost: Number,

});

module.exports = mongoose.model('Majstor', MajstorSchema);