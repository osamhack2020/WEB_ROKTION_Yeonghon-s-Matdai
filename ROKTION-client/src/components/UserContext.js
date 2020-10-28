import React from 'react';

const userContext = React.createContext({
    loginStatus: 0,
    userInfo: {},
    selectedDocumentId: -1,
    documents: [],
    tags: [],
    //임시
    mentionList: [],
    todoList: [],
    handleLogout: ()=>{},
    toMainMenu:()=>{this.setState({selectedDocumentId:-1});},
    createNewMention: ()=>{},
    addPageAfter: ()=>{},
    removePage: ()=>{},
    addNewTag: ()=>{},
    deleteTag: ()=>{},
    changeDocumentSettings: ()=>{},
    toggleTagInDocument: ()=>{},
    createNewDocument: ()=>{},
    deleteDocument: ()=>{},
    shareDocument: ()=>{},
});

export default userContext;