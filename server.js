const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_PORT = process.env.API_PORT;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@field-data-cluster.xz66x.mongodb.net/fieldData?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to Mongodb!');
        app.listen(API_PORT, () => console.log(`Server is running on port ${API_PORT}!`));
    })
    .catch((error) => {console.log(error);});
