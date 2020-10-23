import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class DocumentPageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadTimer: -1,
        }
    }

    onContentChanged = (editor) => {
        // e: 이벤트, 주로 e.target을 쓴다. e.target 하면 html 그대로나오는데 -> name, value
        // data: 호출한 객체 데이터
        const uploadWaitTime = 5000;

        // 여기서 내용이 수정될때마다 서버에 업로드한다.

        if (this.state.uploadTimer > 0) clearTimeout(this.state.uploadTimer);
        // 수정이 정지되고 5초 뒤에 저장되게 한다.
        this.setState({
            uploadTimer: setTimeout(() => {this.updateContent(editor.getData())}, uploadWaitTime),
        })
        // 마지막 수정후 5초 카운트를 세는데, 만일 그사이 수정시 타이머 리셋
        // 그리고 내용을 다시 GET 하는 타이밍은 언제로 해야될까

        // 뭔가 5초는 너무 긴데, 나는 .5초가 적당하다 봄..ㅎ
        // CKEditor 컴포넌트는 변경된 사항이 알아서 내용에 반영되니까
        // 같은 페이지를 수정하고 있으면 굳이 새로 GET할 필요는 없을듯

    }

    updateContent = (content) => {
        console.log('Update Content');
        fetch(`/api/docs/${this.props.myOpt.dbId}/${this.props.myOpt.page}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content
            })
        })
        .then(() => {
            this.props.myOpt.updateLocalPageContents(this.props.myOpt.idx, this.props.myOpt.page, content);
            /*
            return fetch(`/api/docs/${this.props.contentInfo.dbId}/${this.props.contentInfo.page}`, {
                method: 'GET',
            })*/
        })
        .catch(e => {
            console.error(e);
        })
    }

    render() {
        return (
            <CKEditor
                editor={ ClassicEditor }
                // 기존 데이터 넣어주기
                data={this.props.myOpt?.content}
                onInit={ editor => { }}
                onChange={ ( event, editor ) => {
                    this.onContentChanged(editor);
                } }

                // 이 두개는 실시간 저장 켜고 끌 때 쓸 수 있겠다
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
            />
        );
    }
}

export default DocumentPageContent;