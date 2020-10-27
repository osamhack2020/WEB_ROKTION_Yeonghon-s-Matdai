import express, { Request, Response, NextFunction } from "express";
import logger from 'morgan';
import { DB } from "./db";
import session from 'express-session';
import http from 'http';
import socketIO from "socket.io";

import createSocketActions from "./socket";
import userRouter from './routers/user';
import docsRouter from './routers/doc';
import errorHandle from './routers/errorHandle';

// express server
const app = express();
const PORT = 5000;
const db = new DB();
db.initalConnect();
const server = http.createServer(app);
const io = socketIO(server);

// middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'catdog',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000, // 60분
        secure: false,
    }
}));

// routers
app.use('/api/user', userRouter);
app.use('/api/docs', docsRouter);
app.use('/api', errorHandle);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// socket actions
io.on('connection', (socket) => {
    socket.on('test', (message) => {
        console.log(`test: ${message}`);
        io.emit('test', JSON.stringify({message}));
    });

    createSocketActions(io, socket);

    socket.on('disconnect', (reason) => {
        console.log(`disconnect: ${reason}`);
    })
});
