import express, {Request, Response, NextFunction} from "express";
import logger from 'morgan';
import dataRouter from './dataRouter';

const app = express();
const PORT = 5000;

// middleware
app.use(logger('dev'));

app.use(dataRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
