import express, {Request, Response, NextFunction} from "express";
import logger from 'morgan';
import dataRouter from './dataRouter';

const app = express();
const PORT = 5000;

// middlewares
app.use(logger('dev'));

// routers
app.use(dataRouter);

// 404 Not Found
app.use((req: Request, res: Response) => {
    res.status(404).send('NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
