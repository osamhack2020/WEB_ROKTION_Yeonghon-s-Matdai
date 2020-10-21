import express, { Request, Response, NextFunction } from "express";
import { UserModel, Tag } from "../schemas/user";
import crypto from 'crypto';

const router = express.Router();

// 로그오프
router.get('/logoff', (req: Request, res: Response) => {
    // console.log(req.session);
    // VSO 환경에선 쿠키/세션도 안되는듯
    if (req.session?.dbId) {
        req.session.destroy(err => {
            if (err) {
                // 로그오프 실패
                console.log(err);
            } else {
                // 정상 로그오프
                res.status(200).end();
            }
        })
    } else {
        res.status(500).end();
    }
})

// id=tagId인 유저 정보 찾기
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    getTagId(req.params.id)
    .then(n => {
        return UserModel.findOne({ tagId: n }, {_id: 0, passwd: 0, passwdSalt: 0})
    })
    .then((user) => {
        //console.log(user!);
        res.json(user!);
    })
    .catch(err => {
        console.error(err);
        res.status(400).end();
    })    
});

// 로그인
// in: 아이디(=군번, id), 비밀번호(pw)
router.post('/login', (req: Request, res: Response) => {
    // 아이디가 존재하는지 확인
    // 임시용!!!!!!시작
    console.log(req.body);
    req.body = {
        id: '1',
        pw: 'eotjd123'
    }
    // 임시용!!!!!!끝
    getTagId(req.body.id)
    .then(id => {
        return UserModel.findOne({ tagId: id })
    })
    .then(usr => {
        if (usr !== null) {
            // 비밀번호를 암호화해 서버의 값과 비교
            crypto.pbkdf2(req.body.pw, usr.passwdSalt, 1231, 64, 'sha512', (err, key) => {
                if (key.toString('base64') === usr.passwd) {
                    // 맞으면 세션 생성, _id와 tagId를 저장해둔다.
                    req.session!.dbId = usr._id;
                    req.session!.tagId = usr.tagId;
                    //console.log(req.session);
                    console.log(usr.tagId, usr._id);
                    usr.recentLogin = new Date();
                    return usr.save();
                } else {
                    throw new Error(`Wrong password for ${usr.tagId}`);
                }
            })
        } else {
            throw new Error(`No user id with ${req.body.id}`);
        }
    })
    .then(() => {
        res.status(200).end();
    })
    .catch(e => {
        console.error(e);
        res.status(400).send(e);
    })
})

// 새로운 유저 생성
// in: name, belongs, tagId, 
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    let newU = new UserModel({
        name: req.body.name,
        belongs: req.body.belongs,
        recentLogin: new Date(),
    });
    getTagId(req.body.tagId)
    .then(tagId => {
        newU.tagId = tagId;
        crypto.randomBytes(64, (err, buf) => {
            crypto.pbkdf2(req.body.passwd, buf.toString('base64'), 1231, 64, 'sha512', (err, key) => {
                newU.passwd = key.toString('base64');
            });
            newU.passwdSalt = buf.toString('base64');
        });
    })
    .then(() => { 
        return newU.save();
    })
    .then(() => res.status(201).end())
    .catch(e => {
        console.error(e);
        res.status(400).end();
    });
});

// 유저 정보 수정
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    getTagId(req.params.id)
    .then(n => {
        if (req.body.passwd) {
            // 패스워드 변경시
            crypto.randomBytes(64, (err, buf) => {
                crypto.pbkdf2(req.body.passwd, buf.toString('base64'), 1231, 64, 'sha512', (err, key) => {
                    req.body.passwd = key.toString('base64');
                });
                req.body.passwdSalt = buf.toString('base64');
            });
            return UserModel.update({ tagId: n }, {...req.body});
        }
        if (req.body.tags) {
            // 태그 추가 및 제거시 <- 태그와 같이오는 action 문자열로 동작
            if (req.body.tags.action === 'add') {
                // 태그 추가
                return UserModel.findOne({ tagId: n })
                .then(usr => {
                    let newTag: Tag = {
                        name: req.body.tags.name,
                        color: req.body.tags.color,
                    }
                    usr?.tags.push(newTag);
                    return usr?.save();
                })
                .catch(e => e);
            } else if (req.body.tags.action === 'del') {
                // 태그 삭제
                return UserModel.findOne({ tagId: n })
                .then(usr => {
                    usr?.tags.splice(req.body.tags.idx, 1);
                    return usr?.save();
                })
                .catch(e => e);
            }
        }
        return new Error(`Invalid PUT Request on ${req.params.id}`);
    })
    .then(() => res.status(200).end())
    .catch(e => {
        res.status(400).end();
    });    
});

// 유저 정보 삭제
// 연관된 문서도 삭제해야되는지는 고민중
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    getTagId(req.params.id)
    .then(n => {
        UserModel.remove({ tagId: n })
    })
    .then(() => res.status(200).end())
    .catch(e => res.status(400).end());
});

function getTagId(id: string) : Promise<number> {
    const pr = new Promise<number>((resolve, reject) => {
        try {
            if (Number(id) > 0) {
                resolve(Number(id));
            } else {
                throw new Error(`NaN, ${id}`);
            }
        } catch (e) {
            reject(Error(e));
        }
    });
    return pr;
}

export default router;
