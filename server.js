const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const InvalidField = require('./errorTreatment/InvalidField');
const InvalidArgumentError = require('./errorTreatment/InvalidArgumentError');
const localStrategy = require('./shared/authentication-strategies');
var cors = require('cors');
require('dotenv').config();
require('./redis/black-list');

const app = express();
const corsOptions = { exposedHeaders: 'Authorization', origin: 'http://localhost:3000' };
app.use(cors(corsOptions));
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_PORT = process.env.API_PORT;
app.use(localStrategy.initialize());
routes(app);

app.use((error, req, res, next) => {
    let status = 500;

    if (error instanceof InvalidField || error instanceof InvalidArgumentError) {
        status = 400;
    }

    res.status(status).json(error.message);
});

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@field-data-cluster.xz66x.mongodb.net/fieldData?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to Mongodb!');
        app.listen(API_PORT, () => console.log(`Server is running on port ${API_PORT}!`));
    })
    .catch((error) => {console.log(error);});
