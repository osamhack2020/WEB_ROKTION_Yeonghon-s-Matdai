import React, { Component } from 'react';
import { Form, TextArea } from 'semantic-ui-react'

class DocumentPageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadTimer: -1,
            isLoaded: false,
        }
        if (this.props.pageData !== undefined) {
            this.setState({
                isLoaded: true
            });
            this.props.setSavedStatus(5);
        } else {
            this.props.setSavedStatus(4);
        }
    }

    onContentChanged = (e, data) => {
        // e: 이벤트, 주로 e.target을 쓴다. e.target 하면 html 그대로나오는데 -> name, value
        // data: 호출한 객체 데이터
        //console.log(e.target, data);
        const uploadWaitTime = 5000;

        // 여기서 내용이 수정될때마다 서버에 업로드한다.
        this.props.setSavedStatus(1);

        if (this.state.uploadTimer > 0) clearTimeout(this.state.uploadTimer);
        // 수정이 정지되고 5초 뒤에 저장되게 한다.
        this.setState({
            uploadTimer: setTimeout(() => {this.updateContent(data.value)}, uploadWaitTime),
        })
        // 마지막 수정후 5초 카운트를 세는데, 만일 그사이 수정시 타이머 리셋
        // 그리고 내용을 다시 GET 하는 타이밍은 언제로 해야될까
    }

    updateContent = (content) => {
        //console.log('Update Content');
        this.props.setSavedStatus(2);
        fetch(`/api/docs/${this.props.pageData.dbId}/${this.props.pageData.page}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content
            })
        })
        .then(() => {
            this.props.pageData.updateLocalPageContents(this.props.pageData.idx, this.props.pageData.page, content);
            /*
            return fetch(`/api/docs/${this.props.contentInfo.dbId}/${this.props.contentInfo.page}`, {
                method: 'GET',
            })*/
            this.props.setSavedStatus(0);
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
            <Form>
                <TextArea
                    rows='30'
                    defaultValue={this.props.pageData?.content}
                    onChange={this.onContentChanged}
                />
            </Form>
        );
    }
}

export default DocumentPageContent;