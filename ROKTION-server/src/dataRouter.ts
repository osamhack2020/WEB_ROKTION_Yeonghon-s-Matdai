import express, {Request, Response, NextFunction} from "express";

const router = express.Router();

router.get('/data/:id', (req: Request, res: Response, next: NextFunction) => {
    const data = {
        name: req.params.id
    };
    res.json(data);
})

router.get('/data', (req:Request, res:Response, next:NextFunction) => {
    const data = {
        name: 'Test data'
    };
    res.json(data);
});

export default router;
