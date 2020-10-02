import express, {Request, Response, NextFunction} from "express";
import logger from 'morgan';
import { DB } from "./db";

import dataRouter from './routers/data';
import errorHandle from './routers/errorHandle';

const app = express();
const PORT = 5000;
const db = new DB();
db.initalConnect();

// middlewares
app.use(logger('dev'));

// routers
app.use('/data', dataRouter);
app.use(errorHandle);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
