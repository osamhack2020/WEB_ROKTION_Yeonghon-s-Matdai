import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class DocumentPageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadTimer: -1,
            isLoaded: false,
            isSaved: false,
            content: '',
        }
        if (this.props.pageData !== undefined) {
            this.setState({
                isLoaded: true,
                isSaved: true,
            });
            this.props.setSavedStatus(5);
        } else {
            this.props.setSavedStatus(4);
        }
    }

    onSaveKeyDown = (e) => {
        if (this.state.isLoaded && !this.state.isSaved) {
            if (e.ctrlKey) {
                console.log('Force save');
                if (this.state.uploadTimer > 0) clearTimeout(this.state.uploadTimer);
                this.updateContent();
            }
        }
    }

    onContentChanged = (editor) => {
        // e: 이벤트, 주로 e.target을 쓴다. e.target 하면 html 그대로나오는데 -> name, value
        // data: 호출한 객체 데이터
        const uploadWaitTime = 5000;

        // 여기서 내용이 수정될때마다 서버에 업로드한다.
        this.props.setSavedStatus(1);
        this.setState({
            isSaved: false,
            content: data.value,
        });

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

    updateContent = () => {
        //console.log('Update Content');
        this.props.setSavedStatus(2);
        fetch(`/api/docs/${this.props.pageData.dbId}/${this.props.pageData.page}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: this.state.content
            })
        })
        .then(() => {
            this.props.pageData.updateLocalPageContents(this.props.pageData.idx, this.props.pageData.page, this.state.content);
            /*
            return fetch(`/api/docs/${this.props.contentInfo.dbId}/${this.props.contentInfo.page}`, {
                method: 'GET',
            })*/
            this.props.setSavedStatus(0);
            this.setState({
                isSaved: true
            });
        })
        .catch(e => {
            this.props.setSavedStatus(3);
            console.error(e);
        })
    }

    render() {
        if (!this.state.isLoaded && this.props.pageData !== undefined) {
            this.setState({
                isLoaded: true
            })
            this.props.setSavedStatus(5);
        }
        return (
            <CKEditor
                editor={ ClassicEditor }
                // 기존 데이터 넣어주기
                data={this.props.myOpt?.content}
                onInit={ editor => { }}
                onChange={ ( event, editor ) => {
                    this.onContentChanged(editor);
                } }
                onKeyDown={this.onSaveKeyDown}

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