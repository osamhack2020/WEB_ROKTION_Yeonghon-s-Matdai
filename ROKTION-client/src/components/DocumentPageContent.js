import React, { Component } from 'react';
import './Layout.css'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class DocumentPageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadTimer: -1,
            isLoaded: false,
            isSaved: false,
            isSaving: false,
            content: '',
            currentPage: -1,
            editorHandle: null,
        }
        props.setSavedStatus(4);
    }

    onSaveKeyDown = (e, keyData) => {
        //console.log(e, keyData);
        if (this.state.isLoaded && !this.state.isSaved && !this.state.isSaving) {
            if (keyData.ctrlKey) {
                //console.log('Force save');
                if (this.state.uploadTimer > 0) clearTimeout(this.state.uploadTimer);
                this.updateContent(this.state.currentPage, this.state.content);
            }
        }
    }

    onContentChanged = (editor) => {
        // e: 이벤트, 주로 e.target을 쓴다. e.target 하면 html 그대로나오는데 -> name, value
        // data: 호출한 객체 데이터
        const uploadWaitTime = 1000;
        if (!this.state.isLoaded || this.props.sharedPermission < 2 || (this.props.pageData !== undefined && this.props.pageData.isEditing)) {
            return;
        }
        if (this.props.pageData && this.state.currentPage !== this.props.pageData?.page) {
            return;
        }

        // 여기서 내용이 수정될때마다 서버에 업로드한다.
        this.props.setSavedStatus(1);
        this.setState({
            isSaved: false,
            content: editor.getData(),
        });
        window.socket.emit('startPageEditing', {
            docId: this.props.pageData.dbId,
            editingPage: this.props.pageData.page,
        });

        // 수정이 정지되고 5초 뒤에 저장되게 한다.
        if (this.state.uploadTimer > 0) clearTimeout(this.state.uploadTimer);
        this.setState({
            uploadTimer: setTimeout(() => {this.updateContent(this.state.currentPage, this.state.content)}, uploadWaitTime),
        });
        //console.log(timer);
        // 마지막 수정후 5초 카운트를 세는데, 만일 그사이 수정시 타이머 리셋
        // 그리고 내용을 다시 GET 하는 타이밍은 언제로 해야될까

        // 뭔가 5초는 너무 긴데, 나는 .5초가 적당하다 봄..ㅎ
        // CKEditor 컴포넌트는 변경된 사항이 알아서 내용에 반영되니까
        // 같은 페이지를 수정하고 있으면 굳이 새로 GET할 필요는 없을듯
    }

    updateContent = (page, content) => {
        //console.log('Update Content');
        if (!this.state.isLoaded) {
            return;
        }
        if (page < 0) {
            return;
        }

        this.props.setSavedStatus(2);
        this.setState({
            isSaving: true,
        })
        fetch(`/api/docs/${this.props.pageData.dbId}/${this.props.pageData.page}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content
            })
        })
        .then(() => {
            this.props.pageData.updateLocalPageContents(this.props.pageData.idx, page, content);
            window.socket.emit('endPageEditing', {
                docId: this.props.pageData.dbId,
                editedPage: this.props.pageData.page,
            });
            /*
            return fetch(`/api/docs/${this.props.contentInfo.dbId}/${this.props.contentInfo.page}`, {
                method: 'GET',
            })*/
            this.props.setSavedStatus(0);
            this.setState({
                isSaved: true,
                isSaving: false,
            });
        })
        .catch(e => {
            this.props.setSavedStatus(3);
            this.setState({
                isSaving: false
            });
            console.error(e);
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const isLoaded = nextProps.pageData !== null && nextProps.pageData !== undefined;
        const isPageChanged = prevState.currentPage !== nextProps.pageData?.page;
        let toReturn = null;
        if (prevState.isLoaded !== isLoaded || (isLoaded && isPageChanged)) {
            // 로드 상태가 변했을때, 페이지 변경시
            nextProps.setSavedStatus(isLoaded ? 5 : 4);
            toReturn = {
                isLoaded: isLoaded,
                isSaved: true,
                isSaving: false,
                content: isLoaded ? nextProps.pageData.content : '',
                currentPage: isLoaded ? nextProps.pageData.page : -1,
            }
        }

        return toReturn;
    }

    componentDidUpdate(_, prevState) {
        if (this.state.isLoaded !== prevState.isLoaded || prevState.currentPage !== this.state.currentPage) {
            this.props.setSavedStatus(this.state.isLoaded ? 5 : 4);
            clearTimeout(prevState.uploadTimer);
            this.setState({
                uploadTimer: -1,
                isSaved: true,
            });
        }
        var editorHandle = this.state.editorHandle;
        if (editorHandle !== null) editorHandle.isReadOnly = this.state.isSaving || !this.state.isLoaded || this.props.sharedPermission < 2 || (this.props.pageData !== undefined && this.props.pageData.isEditing);
    }

    render() {
        return (
            <CKEditor
                editor={ ClassicEditor }
                // 기존 데이터 넣어주기
                data={this.state.isLoaded ? this.props.pageData.content : '로딩중...'}
                onInit={ editor => {
                    editor.editing.view.document.on('keydown', this.onSaveKeyDown);
                    this.setState({ 
                        editorHandle: editor,
                    });
                } }
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

                style={{
                    height:"calc(100vh - 209.5px - 10.5px)",
                    resizeEnabled:false,
                }}
            />
        );
    }
}

export default DocumentPageContent;