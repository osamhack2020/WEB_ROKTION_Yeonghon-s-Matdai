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
            tagsId:12,
            tags:[
                { name: "진행중", id: 0, color: "#016936" },
                { name: "예정됨", id: 1, color: "#A0A0A0" },
                { name: "완료됨", id: 2, color: "#EE82EE" },
                { name: "인수인계", id: 3, color: "#008080" },
                { name: "문서", id: 4, color: "#A52A2A" },
                { name: "상황병", id: 5, color: "#FF1493" },
                { name: "중대행정병", id: 6, color: "#B03060" },
                { name: "지원과", id: 7, color: "#B413EC" },
                { name: "간부", id: 8, color: "#32CD32" },
                { name: "징계위원회", id: 9, color: "#0E6EB8" },
                { name: "분대장", id: 10, color: "#FE9A76" },
                { name: "임시", id: 11, color: "#000000"},
            ],
            documents:[
                {
                    title: "내가 진행중인 업무",
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
                    tags:[0,4,5],
                },
                {
                    title: "예정된 업무",
                    admin: "대위 OXO",
                    description: "군사경찰대대에서 곧 해야할 것들",
                    alert: 4,
                    id: 2,
                    onClick: ()=>{this.setState({selectedDocumentId:2});},
                    documentContent: [<DocumentPageContent content="That's WeirdChamp bro WeirdChamp"/>],
                    tags:[1,3,6],
                },
                {
                    title: "종료된 업무",
                    admin: "상병 XOX",
                    description: "끄으으읕난 것들",
                    alert: 0,
                    id: 3,
                    onClick: ()=>{this.setState({selectedDocumentId:3});},
                    documentContent: [<DocumentPageContent content="S OMEGALUL BAD"/>],
                    tags:[2,7,8],
                },
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")},tags:[11],},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")},tags:[11],},
            ]
          };
    }

    onLogin = (id, pw) => {
        fetch('/api/user/login', {
            method: 'POST',
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
            // UserInfo null로 돌려놓기
            this.setState({
                logged:false,
                selectedDocumentId:-1,
                userInfo:{
                    regiment:null,
                    rank:null,
                    name:null,
                },
            });
        })
        .catch(e => {
            console.error(e);
        })
    }

    
    getDocumentList = () => {
        const relatedDocs = this.state.userInfo.relatedDocs;
        let i = 0;
        for (let i = 0; i < relatedDocs.created.length; ++i) {
            fetch(`/api/docs/${relatedDocs.created[i].docId}`, {
                method: 'GET'
            })
            .then(res => {
                return res.json();
            })
            .then(docInfo => {
                console.log(docInfo);
                this.state.documents.push({
                    title: docInfo.title,
                    admin: docInfo.author,
                    description: '',
                    alert: 10,
                    id: 5,
                    tags:[11],
                    onClick: () => {this.setState({selectedDocumentId:5})},
                    documentContent: [<DocumentPageContent content={docInfo.title}/>],
                }); 
            })
            .catch(e => {
                console.error(e);
            })
        }
    }

    addNewTag = (name, color) => {
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
    }

    addNewTag = (name, color) => {
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
    }

    render() {
        if (!this.state.logged){
            return(
                <LoginPage handleLogin={this.onLogin}/>
            );
        }
        else{
            let {selectedDocumentId, documents} = this.state;
            let selectedDocument = documents.find(doc => (doc.id === selectedDocumentId));
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
                        documents={documents}
                        tags={this.state.tags}/>
                    </Transition>
            );
        }
    }
}

export default App;
