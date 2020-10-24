import express, { Request, Response, NextFunction } from "express";
import { UserModel, Tag } from "../schemas/user";
import crypto from 'crypto';

const router = express.Router();

// 로그오프
router.get('/logoff', (req: Request, res: Response) => {
    //console.log(req.session);
    checkLogined(req.session!)
    .then(() => {
        req.session?.destroy(err => {
            if (err) {
                // 로그오프 실패
                console.log(err);
                throw err;
            } else {
                // 정상 로그오프
                res.status(200).end();
            }
        })
    })
    .catch(e => {
        res.status(500).end();
    });
})

// id=tagId인 유저 정보 찾기
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    checkLogined(req.session!)
    .then(() => {
        return getTagId(req.params.id);
    })
    .then(n => {
        return UserModel.findOne({ tagId: n }, {_id: 0, passwd: 0, passwdSalt: 0});
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
                    req.session?.save(err => {
                        if (err) {
                            throw new Error(err);
                        }
                    });
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
    Promise.all([
        checkLogined(req.session!),
        getTagId(req.params.id)
    ])
    .then(value => {
        // 로그인 한 유저가 수정하려는건지 확인
        if (value[0] === value[1]) {
            return value[0];
        } else {
            throw new Error('No permission');
        }
    })
    .then(async n => {
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
                try {
                    const usr = await UserModel.findOne({ tagId: n });
                    let newTag: Tag = {
                        name: req.body.tags.name,
                        color: req.body.tags.color,
                    };
                    usr?.tags.push(newTag);
                    return usr?.save();
                } catch (e) {
                    return e;
                }
            } else if (req.body.tags.action === 'del') {
                if (req.body.tags.idx > 4) {
                    // 태그 삭제
                    try {
                        const usr_1 = await UserModel.findOne({ tagId: n });
                        usr_1?.tags.splice(req.body.tags.idx, 1);
                        return usr_1?.save();
                    } catch (e_1) {
                        return e_1;
                    }
                } else {
                    // 기본태그는 삭제 불가능
                    throw new Error(`Default tag cannot be removed`);
                }
            }
        }
        throw new Error(`Invalid PUT Request on ${req.params.id}`);
    })
    .then(() => res.status(200).end())
    .catch(e => {
        res.status(400).end();
    });    
});

// 유저 정보 삭제
// 연관된 문서도 삭제해야되는지는 고민중
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    Promise.all([
        checkLogined(req.session!),
        getTagId(req.params.id)
    ])
    .then(value => {
        // 로그인 한 유저가 수정하려는건지 확인
        if (value[0] === value[1]) {
            return value[0];
        } else {
            throw new Error('No permission');
        }
    })
    .then(n => {
        UserModel.remove({ tagId: n })
    })
    .then(() => res.status(200).end())
    .catch(e => res.status(400).end());
});

// 문자열 군번 값을 숫자로 바꿔주는 친구, Parser
function getTagId(id: string) : Promise<number> {
    return new Promise<number>((resolve, reject) => {
        try {
            if (Number(id) > 0) {
                resolve(Number(id));
            } else {
                let nums = id.split('-');
                let numId = Number(nums[0] + nums[1]);
                if (nums.length === 2 &&  numId > 0) {
                    resolve(numId);
                } else {
                    throw new Error(`NaN, invalid id with ${id}`);
                }
            }
        } catch (e) {
            reject(Error(e));
        }
    });
}

function checkLogined(session: Express.Session) : Promise<number> {
    return new Promise<number>((resolve, reject) => {
        if (session.dbId && session.tagId) {
            resolve(session.tagId);
        } else {
            reject(Error('Not Logined'));
        }
    })
}

export default router;
