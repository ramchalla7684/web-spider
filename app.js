const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const searchRouter = require('./api/routes/search');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

process.on('uncaughtException', (error) => {
    console.error(error);
});

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return response.status(200).json({});
    }

    next();
});

app.use('/search', searchRouter);

app.use((request, response, next) => {
    let error = new Error("Not Found");
    error.status = 404;
    error.custom = true;

    next(error);
});

app.use((error, request, response, next) => {
    if (error.custom) {
        response.status(error.status | 500).json({
            error: {
                message: error.message
            }
        });
    }
    else {
        response.status(error.status | 500).json({
            error: {
                message: 'Unable to handle the request'
            }
        });
    }
});

module.exports = app;