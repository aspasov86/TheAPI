const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const majstorsRoutes = require('./api/routes/majstors');
const usersRoutes = require('./api/routes/users');

mongoose.connect(`mongodb+srv://aspasov:aspasov@cluster0-srjaa.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/api', (req, res) => res.send('Hello World!'));
app.use('/api/majstors', majstorsRoutes);
app.use('/api/users', usersRoutes);

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;