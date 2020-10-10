# ROKTION by 영혼의맞다이

<!--팀명 로고 이미지, 팀소개, 프로젝트 설명 (or 동영상)-->

# 기능 설계

<!--목업 프레임워크 : 카카오 오븐-->
[Kakao Oven](https://ovenapp.io/project/Oe2RQMVa1IWS8jOmZ4S615D2xeDnUJKu#MZCzh)

# 컴퓨터 구성 / 필수 조건 안내 (Prerequisites)

<!--지원 브라우저, 권장 등-->

# 기술 스택 (Technique Used)

## Server (back-end)

<!--사용된 언어, 프레임워크 등-->
- Typescript
- Express
- Mongoose

## Client (front-end)

<!--프레임워크, 라이브러리 등-->
- Typescript
- React
    - Create-React-App

# 설치 안내 (Installation Process)

우선 MongoDB를 설치해야 합니다. - [link](https://docs.mongodb.com/manual/administration/install-community/)

MongoDB가 정상적으로 작동되면, ROKTION-server/src/db.ts의 uri 프로퍼티를 작동중인 DB 서버에 맞게 수정합니다.

개발중에는 MongoDB Atlas를 사용합니다. 관련 이슈로 #12 를 참고해주시기 바랍니다.

```bash
$ npm i -g typescript
$ cd ROKTION-client && npm install
$ cd ../ROKTION-server && npm install
```

# 프로젝트 사용법 (Getting Started)

<!--아무거나 적당히 사용법 작성-->
```bash
$ npm run dev
```
이후 http://(ServerIP):3000/ 으로 접속하면 사용 가능합니다.

# 팀 정보 (Team Infomation)

## 영혼의맞다이 (Yeonghon-s-Matdai)
- Daeseong Shin (esc990720@gmail.com), [Github link](https://github.com/Merseong)
- Donghu Kim (kty2396@gmail.com), [Github link](https://github.com/I-AM-PROTO)

## 저작권 및 사용권 정보 (Copyleft / End User License)
 * [MIT](https://github.com/Merseong/WEB_ROKTION_Yeonghon-s-Matdai/blob/master/LICENSE)
 
