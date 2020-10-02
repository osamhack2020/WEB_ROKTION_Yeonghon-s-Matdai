import express, {Request, Response} from "express";

const router = express.Router();

// 404 Not Found
router.use((req: Request, res: Response) => {
    res.status(404).send('NOT FOUND');
});

// 500 Server Error
router.use((err: Error, req: Request, res: Response) => {
    console.error(err);
    res.status(500).send('SERVER ERROR');
});

export default router;
