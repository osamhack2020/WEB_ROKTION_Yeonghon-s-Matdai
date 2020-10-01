import express, {Request, Response, NextFunction} from "express";

class App {
    public application : express.Application;

    constructor() {
        this.application = express();
    }
}

const app = new App().application;
const PORT = 5000;

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
