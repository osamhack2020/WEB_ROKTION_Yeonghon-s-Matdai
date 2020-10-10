import express, { Request, Response, NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import { Doc, DocModel } from "../schemas/doc";
import { DocInfo, DocInfoModel } from "../schemas/docInfo";
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
// in: 문서 제목(newTitle)
router.post('/', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    // 새로운 DocInfo 생성 <- in 다 넣는다.
    const authorId = mongoose.Types.ObjectId(req.session?.dbId);
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
        author?.relatedDocs.created.splice(0, 0, newDocInfo._id);
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
        return checkPermission(docInfo);
    })
    .then(docInfo => {
        let pgId = docInfo.contents[parseInt(req.params.pg)];
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
        return checkPermission(docInfo);
    })
    .then(docInfo => {
        res.json(docInfo);
    })
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// id의 문서의 pg 갱신하기
// in: 갱신 내용들
router.put('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(docInfo);
    })
    .then(docInfo => {
        let pgId = docInfo.contents[parseInt(req.params.pg)].pageId;
        return DocModel.findById(pgId).update({...req.body});
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// pg 삭제하기
router.delete('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(docInfo);
    })
    .then(docInfo => {
        let pgId = docInfo.contents[parseInt(req.params.pg)].pageId;
        DocModel.findById(pgId).remove();
        docInfo.contents.splice(parseInt(req.params.pg), 1);
        return docInfo.save();
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// id의 문서 삭제하기
router.delete('/:id', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(docInfo);
    })
    .then(docInfo => {
        // 하위 페이지 삭제
        for (let i = 0; i < docInfo.contents.length; ++i) {
            DocModel.findById(docInfo.contents[i].pageId).remove();
        }
        return docInfo.remove();
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// 문서 접근 권한 체크 (WIP)
function checkPermission(docInfo: DocInfo | null) : Promise<DocInfo> {
    return new Promise((resolve, reject) => {
        if (docInfo !== undefined || docInfo !== null) {
            resolve(docInfo!);
        } else {
            reject(new Error('Permission Denied'));
        }
    });
}

export default router;
