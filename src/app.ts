import express, {Request, Response, NextFunction} from 'express';
import router from './router/router';

const app = express();

app.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.send("hello express + typescript");
})

app.use('/router', router);

app.listen(3000, () => {
    console.log('Server start at http://localhost:3000/');
})
