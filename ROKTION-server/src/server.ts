import express, {Request, Response, NextFunction} from "express";
import logger from 'morgan';
import dataRouter from './dataRouter';
import errorHandle from './errorHandle';

const app = express();
const PORT = 5000;

// middlewares
app.use(logger('dev'));

// routers
app.use(dataRouter);
app.use(errorHandle);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
