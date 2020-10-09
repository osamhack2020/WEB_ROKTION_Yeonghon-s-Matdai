import express from "express";
import logger from 'morgan';
import { DB } from "./db";

import userRouter from './routers/user';
import docsRouter from './routers/doc';
import docsInfoRouter from './routers/docInfo';
import errorHandle from './routers/errorHandle';

const app = express();
const PORT = 5000;
const db = new DB();
db.initalConnect();

// middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routers
app.use('/api/user', userRouter);
app.use('/api/docs', docsRouter);
app.use('/api/docsInfo', docsInfoRouter);
app.use('/api', errorHandle);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
