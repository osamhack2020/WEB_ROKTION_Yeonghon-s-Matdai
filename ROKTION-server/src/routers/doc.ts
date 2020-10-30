import express, { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { Doc, DocModel } from "../schemas/doc";
import { DocInfo, DocInfoModel } from "../schemas/docInfo";
import { UserModel } from "../schemas/user";
import { getTagId } from './user';

const router = express.Router();

// id의 문서에 페이지를 추가
// in: 몇페이지의 뒤에 오는지(afterIdx)
router.post('/:id', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // 새로운 Doc 생성
    const newDoc = new DocModel({
        content: '',
        linkedFiles: []
    });
    await newDoc.save();
    // id의 DocInfo를 찾아 contents의 올바른 위치에 삽입
    const docInfoById = await DocInfoModel.findById(req.params.id);
    checkPermission(req.session!, docInfoById)
    .then(async (perm) => {
        if (docInfoById === undefined && docInfoById === null) {
            throw new Error('No document');
        } else if (perm.permissionLevel >= 2) {
            docInfoById?.contents.splice(Number(req.body.afterIdx), 0, {
                pageId: newDoc._id,
                edited: new Date(),
            })
            await docInfoById?.save();
        } else {
            throw new Error('Permission denied');
        }
    })
    .catch(e => {
        console.error(e);
        session.abortTransaction();
        session.endSession();
        res.status(400).json(e);
    });

    await session.commitTransaction();
    session.endSession();
    res.status(201).end();
});

// 새로운 문서를 추가
// in: 문서 제목(title), 문서 색(color)
router.post('/', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    // 새로운 DocInfo 생성 <- in 다 넣는다.
    const authorId = mongoose.Types.ObjectId(req.session?.dbId);
    const newDocInfo = new DocInfoModel({
        title: req.body.title,
        titleColor: req.body.color,
        description: '',
        author: req.session?.tagId,
        status: 0,
        contents: [],
        shareOption: { },
        edited: {
            editor: authorId,
            editDate: new Date()
        }
    });
    // 새로운 Doc 생성 -> DocInfo의 contents에 추가
    const newDoc = new DocModel({
        content: '새로운 문서에 오신걸 환영합니다!',
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
        author?.relatedDocs.created.splice(0, 0, {
            docId: newDocInfo._id,
            docTags: [],
        });
        author?.markModified('relatedDocs');
        await newDoc.save();
        await newDocInfo.save();
        await author?.save();
    } catch (e) {
        console.error(e);
        session.abortTransaction();
        session.endSession();
        res.status(400).json(e);
    }

    // 완료
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
        author: authorId,
        dbId: newDocInfo._id,
    });
});

// id의 문서의 pg 가져오기
// out: pg의 내용
router.get('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session!, docInfo);
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
        return checkPermission(req.session!, docInfo);
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
        return checkPermission(req.session!, docInfo);
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
    console.log(req.session?.id);
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session!, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 3) {
            if (req.body.author && perm.permissionLevel >= 4) {
                // 관리자 이관
                perm.docInfo.author = req.body.author;
            }
            if (req.body.title) {
                // 제목 변경
                perm.docInfo.title = req.body.title;
            }
            if (req.body.color) {
                // 색깔 변경
                perm.docInfo.titleColor = req.body.color;
            }
            if (req.body.shareOption) { 
                // 공유 옵션 변경, 줄땐 tagId로, action: add, del
                if (req.body.shareOption.director) {
                    UserModel.findOne({ tagId: req.body.shareOption.director })
                    .then(usr => {
                        if (usr === null) {
                            throw new Error(`No user with tagId: ${req.body.shareOption.director}`);
                        }
                        if (req.body.shareOption.action === 'add' && perm.permissionLevel > 2) {
                            perm.docInfo.shareOption.director.push(usr.tagId);
                            usr.relatedDocs.shared.push({
                                docId: perm.docInfo._id,
                                docTags: [],
                                permission: 3,
                            });
                        } else if (req.body.shareOption.action === 'del' && perm.permissionLevel > 2) {
                            const uidx = perm.docInfo.shareOption.director.findIndex(tagId => tagId === usr!.tagId);
                            if (uidx >= 0) perm.docInfo.shareOption.director.splice(uidx, 1);
                            const didx = usr.relatedDocs.shared.findIndex(dv => dv.docId === perm.docInfo._id);
                            if (didx >= 0) usr.relatedDocs.shared.splice(didx, 1);
                        } else {
                            throw new Error('Permission denied / Invalid action');
                        }
                        perm.docInfo.markModified('shareOption.director');
                        perm.docInfo.save();
                        usr.markModified('relatedDocs');
                        usr.save();
                    })
                    .catch(e => {
                        throw e;
                    });
                } else if (req.body.shareOption.editor) {
                    UserModel.findOne({ tagId: req.body.shareOption.editor })
                    .then(usr => {
                        if (usr === null) {
                            throw new Error(`No user with tagId: ${req.body.shareOption.editor}`);
                        }
                        if (req.body.shareOption.action === 'add' && perm.permissionLevel > 2) {
                            perm.docInfo.shareOption.editor.push(usr.tagId);
                            usr.relatedDocs.shared.push({
                                docId: perm.docInfo._id,
                                docTags: [],
                                permission: 2,
                            });
                        } else if (req.body.shareOption.action === 'del' && (perm.permissionLevel > 2 || req.body.shareOption.editor === req.session?.tagId)) {
                            const uidx = perm.docInfo.shareOption.editor.findIndex(tagId => tagId === usr!.tagId);
                            if (uidx >= 0) perm.docInfo.shareOption.editor.splice(uidx, 1);
                            const didx = usr.relatedDocs.shared.findIndex(dv => dv.docId === perm.docInfo._id);
                            if (didx >= 0) usr.relatedDocs.shared.splice(didx, 1);
                        } else {
                            throw new Error('Permission denied / Invalid action');
                        }
                        perm.docInfo.markModified('shareOption.editor');
                        perm.docInfo.save();
                        usr.markModified('relatedDocs');
                        usr.save();
                    })
                    .catch(e => {
                        throw e;
                    });
                } else if (req.body.shareOption.viewer) {
                    UserModel.findOne({ tagId: req.body.shareOption.viewer })
                    .then(usr => {
                        if (usr === null) {
                            throw new Error(`No user with tagId: ${req.body.shareOption.viewer}`);
                        }
                        if (req.body.shareOption.action === 'add' && perm.permissionLevel > 2) {
                            perm.docInfo.shareOption.viewer.push(usr.tagId);
                            usr.relatedDocs.shared.push({
                                docId: perm.docInfo._id,
                                docTags: [],
                                permission: 1,
                            });
                        } else if (req.body.shareOption.action === 'del' && (perm.permissionLevel > 2 || req.body.shareOption.viewer === req.session?.tagId)) {
                            const uidx = perm.docInfo.shareOption.viewer.findIndex(tagId => tagId === usr!.tagId);
                            if (uidx >= 0) perm.docInfo.shareOption.viewer.splice(uidx, 1);
                            const didx = usr.relatedDocs.shared.findIndex(dv => dv.docId === perm.docInfo._id);
                            if (didx >= 0) usr.relatedDocs.shared.splice(didx, 1);
                        } else {
                            throw new Error('Permission denied / Invalid action');
                        }
                        perm.docInfo.markModified('shareOption.viewer');
                        perm.docInfo.save();
                        usr.markModified('relatedDocs');
                        usr.save();
                    })
                    .catch(e => {
                        throw e;
                    });
                } else {
                    throw new Error('Undefined action');
                }
            }
            perm.docInfo.save();
        } else {
            throw new Error('Permission Denied');
        }
    })
    .then(() => {
        res.status(200).end();
    })
    .catch(e => {
        console.error(e);
        res.status(400).json(e);
    })
})

// pg 삭제하기
router.delete('/:id/:pg', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session!, docInfo);
    })
    .then(async perm => {
        if (perm.permissionLevel >= 4) {
            let pgId = perm.docInfo.contents[parseInt(req.params.pg)].pageId;
            await DocModel.deleteOne({ _id: pgId });
            perm.docInfo.contents.splice(parseInt(req.params.pg), 1);
            await perm.docInfo.save();
        } else {
            throw new Error('Permission denied');
        }
    })
    .then(() => res.status(200).end())
    .catch(e => {
        console.error(e);
        res.status(400).json(e);
    })
});

// id의 문서 삭제하기
router.delete('/:id', (req: Request, res: Response) => {
    DocInfoModel.findById(req.params.id)
    .then(docInfo => {
        return checkPermission(req.session!, docInfo);
    })
    .then(perm => {
        if (perm.permissionLevel >= 4) {
            // 하위 페이지 삭제
            for (let i = 0; i < perm.docInfo.contents.length; ++i) {
                DocModel.findById(perm.docInfo.contents[i].pageId)
                .then(doc => {
                    return doc?.remove();
                })
                .catch(e => {
                    throw e;
                })
            }
            // user의 리스트에서도 삭제
            //console.log(req?.session);
            UserModel.findById(req.session?.dbId)
            .then(user => {
                console.log(user?.name);
                const createdDocIdx = user?.relatedDocs.created.findIndex(docView => docView.docId.toHexString() == req.params.id);
                const sharedDocIdx = user?.relatedDocs.shared.findIndex(docView => docView.docId.toHexString() == req.params.id);
                if (createdDocIdx! >= 0) {
                    user?.relatedDocs.created.splice(createdDocIdx!, 1);
                } else if (sharedDocIdx! >= 0) {
                    user?.relatedDocs.shared.splice(sharedDocIdx!, 1);
                }
                user?.markModified('relatedDocs');
                return user?.save();
            })
            .catch(e => {
                throw e;
            })
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

// 문서 접근 권한 체크
function checkPermission(session: Express.Session, docInfo: DocInfo | null) : Promise<Permission> {
    return new Promise((resolve, reject) => {
        console.log(docInfo?.author, docInfo?.shareOption, session.tagId);
        if (docInfo !== undefined && docInfo !== null && session.dbId !== undefined && session.dbId !== null) {
            let pl: PermissionLevel = PermissionLevel.forbidden;
            if (docInfo.author == session.tagId) {
                pl = PermissionLevel.owner;
            } else if (docInfo.shareOption.director?.indexOf(session.tagId) >= 0) {
                pl = PermissionLevel.director;
            } else if (docInfo.shareOption.editor?.indexOf(session.tagId) >= 0) {
                pl = PermissionLevel.editor;
            } else if (docInfo.shareOption.viewer?.indexOf(session.tagId) >= 0) { 
                pl = PermissionLevel.viewer;
            } else { 
                pl = PermissionLevel.forbidden; 
            }
            console.log(pl);
            resolve({
                docInfo: docInfo!,
                permissionLevel: pl,
            });
        } else {
            reject(new Error(`Can\'t check permission, ${session.dbId}`));
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
