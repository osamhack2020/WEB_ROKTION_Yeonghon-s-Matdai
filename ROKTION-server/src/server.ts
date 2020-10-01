import express, {Request, Response, NextFunction} from "express";
import logger from 'morgan';

class App {
    public application : express.Application;

    constructor() {
        this.application = express();
    }
}

const app = new App().application;
const PORT = 5000;

// middleware
app.use(logger('dev'));

app.get('/data', (req:Request, res:Response, next:NextFunction) => {
    const data = {
        lastname : "Done",
        firstname : "Test"
    };
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
