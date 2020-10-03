import express, { Request, Response, NextFunction } from "express";
import { User, UserModel } from "../schemas/user";

const router = express.Router();

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const toSend = {
        data: {}
    };
    getTagId(req.params.id)
    .then(n => {
        UserModel.find({ tagId: n })
        .then((users) => {
            toSend.data = users[0];
            res.json(toSend);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
    })
    .catch(e => {
        res.status(400).end();
    });  
    
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    let newU = new UserModel(req.body);
    newU.save()
    .then(() => res.status(201).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    });
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    getTagId(req.params.id)
    .then(n => {
        UserModel.update({ tagId: n }, {...req.body})
        .then(() => res.status(200).end())
        .catch(e => {
            throw new Error(e);
        })
    })
    .catch(e => {
        res.status(400).end();
    });    
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    getTagId(req.params.id)
    .then(n => {
        UserModel.remove({ tagId: n });
        res.status(200).end();
    })
    .catch(e => {
        res.status(400).end();
    });    
});

function getTagId(id: string) : Promise<number> {
    const pr = new Promise<number>((resolve, reject) => {
        try {
            resolve(Number(id));
        } catch (e) {
            reject(Error(e));
        }
    });
    return pr;
}

export default router;
