import express, {Request, Response, NextFunction} from "express";
import { User, UserModel } from "../schemas/user";

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    let myData = {
        name: 'empty'
    };
    UserModel.find()
        .then((users) => {
            myData.name = users[1].name;
        })
        .then(() => {
            res.json(myData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const myData = {
        name: 'empty'
    };
    UserModel.find({ tagId: Number(req.params.id) })
        .then((users) => {
            myData.name = users[0].name;
        })
        .then(() => {
            res.json(myData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
})

export default router;
