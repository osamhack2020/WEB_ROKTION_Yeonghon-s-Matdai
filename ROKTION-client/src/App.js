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
                },
                {
                    title: "예정된 업무",
                    admin: "대위 OXO",
                    description: "군사경찰대대에서 곧 해야할 것들",
                    alert: 4,
                    id: 2,
                    onClick: ()=>{this.setState({selectedDocumentId:2});},
                    documentContent: [<DocumentPageContent content="That's WeirdChamp bro WeirdChamp"/>],
                },
                {
                    title: "종료된 업무",
                    admin: "상병 XOX",
                    description: "끄으으읕난 것들",
                    alert: 0,
                    id: 3,
                    onClick: ()=>{this.setState({selectedDocumentId:3});},
                    documentContent: [<DocumentPageContent content="S OMEGALUL BAD"/>],
                },
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
                { title:"PlaceHolder", description:"Holding place :/", alert:0, id:4, onClick:()=>{console.log("POGGERS")}},
        
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
            console.log(userData);
            this.setState({
                logged:true,
                userInfo: userData,
            });
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
                        documents={documents}
                        tags={[]}/>
                    </Transition>
            );
        }
    }
}

export default App;
