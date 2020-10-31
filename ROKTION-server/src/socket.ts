import SocketIO from "socket.io";

interface UserSocket extends SocketIO.Socket {
    tagId: string;
    currentDocument: string,
    currentPage: number,
}

const createSocketActions = (io: SocketIO.Server, socket: SocketIO.Socket) => {
    // 소켓에 간단한 유저데이터 넣기
    socket.on('linkData', (userData) => { // tagId: 유저의 군번, 
        (socket as UserSocket).tagId = userData.tagId;
        // (socket as UserSocket).tagId 로 확인가능
    })

    // 문서 정보 업데이트시 GET을 호출하도록
    socket.on('updateDocInfo', (docData) => { // docId: 문서의 ID
        //console.log(`got updated, ${docData.docId}`);
        socket.broadcast.emit('updateDocInfo', docData);
    })
    // 공유설정이나 언급이나 그런거 변경시
    socket.on('updateUser', (userTagId) => {
        socket.broadcast.emit('updateUser', userTagId);
    })

    // 페이지 수정중 다른 사람이 수정 못하게
    socket.on('enterDocumentPage', (docData) => { // docId: 보고있는 문서 ID, pageIdx: 보고있는 페이지 번호
        socket.join(docData.docId);
    })
    socket.on('startPageEditing', (editing) => { // docId: 보고있는 문서 ID, editingPage: 수정중인 페이지 번호
        // 혼자만 접속중이면 안보내도됨
        socket.broadcast.to(editing.docId).emit('startPageEditing', editing.editingPage);
    })
    // 보고있는 사람들 수정불가 해제
    socket.on('endPageEditing', (edited) => { // docId: 보고있는 문서 ID, editedPage: 수정을 완료한 페이지 번호
        // 보고있는 사람들 수정불가 해제
        socket.broadcast.to(edited.docId).emit('endPageEditing', edited.editedPage);
        // 브로드캐스트로도 보내서 받으면 그 내용만 다시 GET
        socket.broadcast.emit('pageEdited', edited);
    })
    socket.on('exitDocumentPage', (docData) => { // docId: 보고있는 문서 ID, pageIdx: 보고있는 페이지 번호
        socket.leave(docData.docId);
    })
}

export default createSocketActions;
