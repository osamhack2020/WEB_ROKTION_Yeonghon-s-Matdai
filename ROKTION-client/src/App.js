import React, { Component } from 'react';
import './App.css';
import DocumentPage from './components/DocumentPage';
import DocumentPageContent from './components/DocumentPageContent';
import MainMenuLayout from './components/MainMenuLayout';
import LoginPage from './components/LoginPage';
import {
    Transition,
  } from 'semantic-ui-react'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            logged: false,
            userInfo:{
                regiment:null,
                rank:null,
                name:null,
            },
            selectedDocumentId: -1,
            tagsId:0,
            tags:[
                /*
                { name: "진행중", id: 0, color: "#016936" },
                { name: "예정됨", id: 1, color: "#A0A0A0" },
                { name: "완료됨", id: 2, color: "#EE82EE" },
                { name: "문서", id: 3, color: "#A52A2A" },
                { name: "중요", id: 4, color: "#D4B802" },
                { name: "인수인계", id: 5, color: "#008080" },
                { name: "상황병", id: 6, color: "#FF1493" },
                { name: "중대행정병", id: 7, color: "#B03060" },
                { name: "지원과", id: 8, color: "#B413EC" },
                { name: "간부", id: 9, color: "#32CD32" },
                { name: "징계위원회", id: 10, color: "#0E6EB8" },
                { name: "분대장", id: 11, color: "#FE9A76" },
                { name: "주인없는태그", id: 12, color: "#000000"},
                { name: "주인없는태그", id: 13, color: "#000000"},
                { name: "주인없는태그", id: 14, color: "#000000"},
                { name: "주인없는태그", id: 15, color: "#000000"},
                */
            ],
            documents:[
                /*
                {
                    title: "내가 진행중인진행중인진행중인진행중인진행중인진행중인진행중인 업무",
                    admin: "중위 XOX",
                    description: "지이이인행중인 업무들",
                    alert: 15,
                    id: 1,
                    onClick: ()=>{this.setState({selectedDocumentId:1});},
                    documentContent: [<DocumentPageContent content="That is such a PogU moment bro"/>,
                                      <DocumentPageContent content="POG"/>,
                                      <DocumentPageContent content="POGPOG"/>,
                                      <DocumentPageContent content="POGPOGPOG"/>,
                                      <DocumentPageContent content="POGPOGPOGPOG"/>,
                                      <DocumentPageContent content="POGPOGPOGPOGPOG"/>,
                                      <DocumentPageContent content="POGPOGPOGPOGPOGPOG"/>,
                                      <DocumentPageContent content="POGPOGPOGPOGPOGPOGPOG"/>,],
                    tags:new Set([0,4,5,6,7,8,9,10,11,12,13]),
                },
                {
                    title: "예정된 업무",
                    admin: "대위 OXO",
                    description: "군사경찰대대에서 곧 해야할 것들",
                    alert: 4,
                    id: 2,
                    onClick: ()=>{this.setState({selectedDocumentId:2});},
                    documentContent: [<DocumentPageContent content="That's WeirdChamp bro WeirdChamp"/>],
                    tags: new Set([1,3,6,7,8,9,10,11,12]),
                },
                {
                    title: "종료된 업무",
                    admin: "상병 XOX",
                    description: "끄으으읕난 것들",
                    alert: 0,
                    id: 3,
                    onClick: ()=>{this.setState({selectedDocumentId:3});},
                    documentContent: [<DocumentPageContent content="S OMEGALUL BAD"/>],
                    tags: new Set([2,7,8]),
                },
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")},tags:new Set([11]),},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:5, onClick:()=>{console.log("POGGERS")},tags:new Set([11]),},
                */
            ]
          };
    }

    onLogin = (id, pw) => {
        fetch('/api/user/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                pw: pw
            })
        })
        .then(res => {
            if (res.status === 200) {
                return fetch(`/api/user/${id}`, { 
                    method: 'GET',
                })
            } else {
                console.error(res.status);
            }
        })
        .then(data => {
            return data.json();
        })
        .then(userData => {
            //console.log(userData);
            this.setState({
                logged: true,
                userInfo: userData,
            });
            //console.log(this.state.documents);
            this.getUserTags();
            this.getDocumentList();
        })
        .catch(e => {
            console.error(e);
        }) 
    }

    onLogout = () => {
        // 서버에 로그오프 요청을 보낸다.
        fetch('/api/user/logoff', {
            method: 'GET'
        })
        .then(res => {
            if (res.status === 200) {
                console.log('Completely logoff');
            } else {
                console.error(res.status);
            }
        })
        .then(() => {
            // UserInfo null로 돌려놓기, Document나 Tag들도 리셋해야됨.
            this.setState({
                logged:false,
                selectedDocumentId:-1,
                userInfo:{
                    regiment:null,
                    rank:null,
                    name:null,
                },
                documents: [],
            });
        })
        .catch(e => {
            console.error(e);
        })
    }

    getUserTags = () => {
        console.log('Start getUserTags');
        const tags = this.state.userInfo.tags;
        for (let i = 0; i < tags.length; ++i) {
            this.addNewTag(tags[i].name, tags[i].color);
        }
        console.log(this.state.tags)
        console.log('End getUserTags');
    }
    
    getDocumentList = () => {
        console.log('Start getDocumentList');
        const relatedDocs = this.state.userInfo.relatedDocs;
        const docsAlready = 0; // 임시용
        for (let i = docsAlready; i < relatedDocs.created.length + docsAlready; ++i) {
            // 이거 비동기로 돌아감
            fetch(`/api/docs/${relatedDocs.created[i - docsAlready].docId}`, {
                method: 'GET'
            })
            .then(res => {
                return res.json();
            })
            .then(docInfo => {
                let newState = this.state.documents;
                let newTags = relatedDocs.created[i - docsAlready].docTags;
                newTags.push(docInfo.status);
                newState[i] = {
                    title: docInfo.title,
                    admin: docInfo.author,
                    description: '',
                    alert: this.state.documents.length,
                    id: i,
                    dbId: docInfo._id,
                    // 태그 이제 Set으로 처리함
                    tags: new Set(newTags),
                    // tags:new Set([11]), // 임시용
                    onClick: () => {this.setState({selectedDocumentId: i})},
                    documentContent: [],
                    pagesLength: docInfo.contents.length,
                }
                this.setState({
                    documents: newState
                }); 
                console.log(this.state.documents[i])
            })
            .catch(e => {
                console.error(e);
            })
        }
        console.log('End getDocumentList');
    }

    getPageContents = (document, idx) => {
        for (let i = 0; i < document.pagesLength; ++i) {
            fetch(`/api/docs/${document.dbId}/${i}`, {
                method: 'GET'
            })
            .then(res => {
                return res.json();
            })
            .then(page => {
                //console.log(page);
                let docs = this.state.documents;
                //console.log(docs[idx]);
                docs[idx].documentContent[i] = <DocumentPageContent content={page.content}/>;
                this.setState({
                    documents: docs,
                })
            })
            .catch(e => {
                console.error(e);
            })
        }
    }
        
    addNewTag = (name, color, isNew = false) => {
        const tags = this.state.tags;
        const tagsId = this.state.tagsId;
        this.setState({
            tags: tags.concat({
                name: name,
                id: this.state.tagsId,
                color: color,
            }),
            tagsId: tagsId+1,
        })
        
        if (isNew) {
        /* body 비는 문제 해결전까지 일단 만들어만 둔다
            // 서버에 추가한 태그를 보낸다
            fetch(`/${this.state.userInfo.tagId}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tags: {
                        action: 'add',
                        name: name,
                        color: color,
                    }
                })
            })
        */
        }
    }

    deleteTag = (id) => {
        // 0번부터 3번까지는 기본태그기 때문에 삭제 불가능하게 해야됨
        let tags = this.state.tags;
        const idx = tags.findIndex(tag => (tag.id === id));
        tags.splice(idx, 1);
        if (idx > -1){
            this.setState({
                tags:tags,
            })
        }
        /* body 비는 문제 해결전까지 일단 만들어만 둔다
        // 서버에 삭제한 태그의 index를 보낸다.
        fetch(`/${this.state.userInfo.tagId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tags: {
                    action: 'del',
                    idx: idx
                }
            })
        })
        */
    }

    toggleTagInDocument = (docid, tagid) => {
        const docs = this.state.documents;
        const docTags = docs.find(doc => (doc.id===docid)).tags;
        if (tagid <= 3){
            //주요태그 (진행중/예정됨/완료됨/문서)
            docTags.delete(0);
            docTags.delete(1);
            docTags.delete(2);
            docTags.delete(3);
            docTags.add(tagid);
        }
        else if (docTags.has(tagid)){
            //태그삭제
            docTags.delete(tagid);
        }
        else{
            //태그추가
            docTags.add(tagid);
        }

        this.setState({
            documents:
                docs.map(
                    doc => (
                        doc.id === docid ?
                        {...doc, tags:docTags}:
                        {...doc}
                    )
                )
        })
    }

    render() {
        if (!this.state.logged){
            return(
                <LoginPage handleLogin={this.onLogin}/>
            );
        }
        else{
            let {selectedDocumentId, documents} = this.state;
            let selectedDocument = documents.find(doc => doc?.id === selectedDocumentId);
            //console.log(selectedDocument);
            if (selectedDocument !== undefined && selectedDocument.documentContent.length === 0) {
                this.getPageContents(selectedDocument, selectedDocumentId);
            }
            return (
                selectedDocument !== undefined ?
                    <Transition onShow={()=>{console.log("mounted")}} transitionOnMount={true} unmountOnHide={true} duration ={{hide:500, show:500}}>
                        <DocumentPage
                        handleLogout={this.onLogout}
                        information={this.state}
                        toMainMenu={()=>{this.setState({selectedDocumentId:-1}); console.log("문서목록!")}}/>
                    </Transition>:
                    <Transition transitionOnMount={true} unmountOnHide={true} duration ={{hide:500, show:500}}>
                        <MainMenuLayout
                        handleLogout={this.onLogout}
                        userInfo={this.state.userInfo}
                        addNewTag={this.addNewTag}
                        deleteTag={this.deleteTag}
                        toggleTagInDocument={this.toggleTagInDocument}
                        documents={this.state.documents}
                        tags={this.state.tags}/>
                    </Transition>
            );
        }
    }
};

export default App;
