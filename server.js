const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const InvalidField = require('./errorTreatment/InvalidField');
const InvalidArgumentError = require('./errorTreatment/InvalidArgumentError');
const localStrategy = require('./shared/authentication-strategies');
var cors = require('cors');
require('dotenv').config();
require('./redis/black-list');
const { createServer } = require("http");
const { Server } = require("socket.io");
const validateToken = require('./shared/tokenValidation');
const socketHandler = require('./shared/socketQueries');

const app = express();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;
const corsOptions = { exposedHeaders: 'Authorization' };
app.use(cors(corsOptions));
app.use(localStrategy.initialize());
routes(app);

app.use((error, req, res, next) => {
    let status = 500;

    if (error instanceof InvalidField || error instanceof InvalidArgumentError) {
        status = 400;
    }

    res.status(status).json(error.message);
});



const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: FRONT_URL } });

io.use( async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const user = await validateToken(token);
        socket.user = user;
        next();
      } catch (e) {
        next(new Error(e.message));
      }
});

const onConnection = (socket) => {
    socketHandler(io, socket);
}

io.on("connection", onConnection);

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@field-data-cluster.xz66x.mongodb.net/fieldData?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to Mongodb!');
        httpServer.listen(API_PORT, () => console.log(`Server is running on port ${API_PORT}!`));
    })
    .catch((error) => {console.log(error);});
