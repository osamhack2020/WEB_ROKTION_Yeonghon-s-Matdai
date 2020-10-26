import express from "express";
import logger from 'morgan';
import { DB } from "./db";
import session from 'express-session';
import http from 'http';
import socketIO from "socket.io";

import userRouter from './routers/user';
import docsRouter from './routers/doc';
import errorHandle from './routers/errorHandle';

// express server
const app = express();
const PORT = 5000;
const db = new DB();
db.initalConnect();

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
}))

// routers
app.use('/api/user', userRouter);
app.use('/api/docs', docsRouter);
app.use('/api', errorHandle);

// socket server
function runSocketServer(port: number): void {
    const server = http.createServer(app);
    const io = socketIO(server);

    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });

    io.on('connection', (socket) => {
        console.log('connected');
        socket.on('test', (message) => {
            console.log(message);
            io.emit('test', JSON.stringify({message}));
        });

        socket.on('disconnect', (reason) => {
            console.log(reason);
        })
    });
}

runSocketServer(PORT);
