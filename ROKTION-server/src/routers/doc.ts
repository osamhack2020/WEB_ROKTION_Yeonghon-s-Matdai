import express, { Request, Response, NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import { DocModel } from "../schemas/doc";
import { DocInfoModel } from "../schemas/docInfo";
import { UserModel } from "../schemas/user";

const router = express.Router();

// id의 문서에 페이지를 추가
// in: 몇페이지의 뒤에 오는지(afterIdx)
router.post('/:id', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // 새로운 Doc 생성
    const newDoc = new DocModel({
        pageTitle: 'New Page',
        content: '',
        linkedFiles: []
    });
    await newDoc.save();
    // id의 DocInfo를 찾아 contents의 올바른 위치에 삽입
    try {
        const docInfoById = await DocInfoModel.findById(req.params.id);
        if (docInfoById !== undefined) {
            await docInfoById?.update({ $set: {
                contents: docInfoById.contents.splice(req.body.afterIdx, 0, newDoc._id)
            }});
        } else {
            session.abortTransaction();
            session.endSession();
            res.status(400).end();
        }
    } catch (e) {
        console.error(e);
        session.abortTransaction();
        session.endSession();
        res.status(400).end();
    }

    // 완료
    await session.commitTransaction();
    session.endSession();
    res.status(201).end();
});

// 새로운 문서를 추가
// in: 문서 제목(newTitle), 생성자(authorId)
router.post('/', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    // 새로운 DocInfo 생성 <- in 다 넣는다.
    const authorId = mongoose.Types.ObjectId(req.body.authorId);
    const newDocInfo = new DocInfoModel({
        title: req.body.newTitle,
        author: authorId,
        contents: [],
        shareOption: {},
        edited: {
            editor: authorId,
            editTime: new Date()
        }
    });
    // 새로운 Doc 생성 -> DocInfo의 contents에 추가
    const newDoc = new DocModel({
        pageTitle: 'New Page',
        content: '',
        linkedFiles: []
    });
    newDocInfo.contents.push({
        title: newDoc.pageTitle,
        pageId: newDoc._id
    });
    // 생성자의 db에서 relatedDocs에 새로운 DocInfo 추가
    const author = await UserModel.findById(authorId);
    try {
        author?.relatedDocs.created.push(newDocInfo._id);
        await newDoc.save();
        await newDocInfo.save();
        await author?.save();
    } catch (e) {
        console.error(e);
        session.abortTransaction();
        session.endSession();
        res.status(400).end();
    }

    // 완료
    await session.commitTransaction();
    session.endSession();
    res.status(201).end();
});

// id의 문서의 pg 가져오기
// out: pg의 내용
router.get('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        // 여기서 문서의 접근 권한을 체크해야됨
        let pgId = docInfo?.contents[parseInt(req.params.pg)];
        return DocModel.findById(pgId);
    })
    .then(doc => {
        res.json(doc);
    })
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// id의 문서의 정보(docinfo) 가져오기
router.get('/:id', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        // 문서 접근 권한 체크
        res.json(docInfo);
    })
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// id의 문서의 pg 갱신하기
router.put('/:id/:pg', (req: Request, res: Response) => {

});

// pg 삭제하기
router.delete('/:id/:pg', (req: Request, res: Response) => {

});

// id의 문서 삭제하기
router.delete('/:id', (req: Request, res: Response) => {

});

export default router;
