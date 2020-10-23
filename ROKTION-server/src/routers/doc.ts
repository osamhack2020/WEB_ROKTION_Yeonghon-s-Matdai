import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
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
    const docInfoById = await DocInfoModel.findById(req.params.id);
    checkPermission(req.session?.dbId, docInfoById)
    .then(perm => {
        if (docInfoById === undefined && docInfoById === null) {
            throw new Error('No document');
        } else if (perm.permissionLevel >= 2) {
            docInfoById?.update({ $set: {
                contents: docInfoById.contents.splice(req.body.afterIdx, 0, newDoc._id)
            }});
        } else {
            throw new Error('Permission denied');
        }
    })
    .catch(e => {
        console.error(e);
        session.abortTransaction();
        session.endSession();
        res.status(400).end();
    });

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
        shareOption: {
            owner: req.session!.dbId,
        },
        edited: {
            editor: authorId
        }
    });
    // 새로운 Doc 생성 -> DocInfo의 contents에 추가
    const newDoc = new DocModel({
        content: '',
        linkedFiles: []
    });
    newDocInfo.contents.push({
        pageId: newDoc._id,
        editing: undefined,
        edited: new Date()
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
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 1) {
            let pgId = perm.docInfo.contents[Number(req.params.pg)].pageId;
            //console.log(pgId);
            return DocModel.findById(pgId);
        } else {
            throw new Error('Permission denied');
        }
    })
    .then(doc => {
        //console.log(doc);
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
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 1) {
            res.json(perm.docInfo);
        } else {
            throw new Error('Permission denied');
        }
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
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 2) {
            let pgId = perm.docInfo.contents[parseInt(req.params.pg)].pageId;
            return DocModel.updateOne({ _id: pgId }, {...req.body});
        } else {
            throw new Error('Permission denied');
        }
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// id의 문서의 옵션을 갱신하기
// in: 갱신 내용들
router.put('/:id', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 3) {
            let toUpdate: any = {}
            if (req.body.author && perm.permissionLevel >= 4) {
                // 관리자 이관
                toUpdate.author = req.body.author;
            }
            if (req.body.title) {
                // 제목 변경
                toUpdate.title = req.body.title;
            }
            if (req.body.shareOption) {
                // 공유 옵션 변경
                toUpdate.shareOption = req.body.shareOption;
            }
            return perm.docInfo.update({
                $set: toUpdate
            });
        } else {
            throw new Error('Permission denied');
        }
    })
    .then(() => {
        res.status(200).end();
    })
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
})

// pg 삭제하기
router.delete('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 4) {
            let pgId = perm.docInfo.contents[parseInt(req.params.pg)].pageId;
            DocModel.findById(pgId).remove();
            perm.docInfo.contents.splice(parseInt(req.params.pg), 1);
            return perm.docInfo.save();
        } else {
            throw new Error('Permission denied');
        }
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
        return checkPermission(req.session?.dbId, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 4) {
            // 하위 페이지 삭제
            for (let i = 0; i < perm.docInfo.contents.length; ++i) {
                DocModel.findById(perm.docInfo.contents[i].pageId).remove();
            }
            return perm.docInfo.remove();
        } else {
            throw new Error('Permission denied');
        }
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    })
});

// 문서 접근 권한 체크 (WIP)
function checkPermission(dbId: mongoose.Types.ObjectId, docInfo: DocInfo | null) : Promise<Permission> {
    return new Promise((resolve, reject) => {
        resolve({
            docInfo: docInfo!,
            permissionLevel: PermissionLevel.owner,
        });
        if (docInfo !== undefined && docInfo !== null && dbId !== undefined && dbId !== null) {
            let pl: PermissionLevel = PermissionLevel.forbidden;
            if (docInfo.author === dbId) {
                pl = PermissionLevel.owner;
            } else if (docInfo.shareOption.director.indexOf(dbId) > 0) {
                pl = PermissionLevel.director;
            } else if (docInfo.shareOption.editor.indexOf(dbId) > 0) {
                pl = PermissionLevel.editor;
            } else if (docInfo.shareOption.viewer.indexOf(dbId) > 0) { 
                pl = PermissionLevel.viewer;
            } else { 
                pl = PermissionLevel.forbidden; 
            }
            resolve({
                docInfo: docInfo!,
                permissionLevel: pl,
            });
        } else {
            reject(new Error('Can\'t check permission'));
        }
    });
}

// 확인된 권한
interface Permission {
    docInfo: DocInfo,
    permissionLevel: PermissionLevel
}

enum PermissionLevel {
    forbidden = 0,
    viewer,
    editor,
    director,
    owner
}

export default router;
