import React from 'react';

const userContext = React.createContext({
    loginStatus: 0,
    userInfo: {},
    selectedDocumentId: -1,
    selectedPage: 0,
    documents: [],
    tags: [],
    //임시
    mentionList: [],
    todoList: [],
    //임시
    handleLogout: ()=>{},
    toMainMenu:()=>{this.setState({selectedDocumentId:-1});},
    createNewMention: ()=>{},
    removeMention: ()=>{},
    createNewTodo: ()=>{},
    removeTodo: ()=>{},
    addPageAfter: ()=>{},
    removePage: ()=>{},
    addNewTag: ()=>{},
    deleteTag: ()=>{},
    changeDocumentSettings: ()=>{},
    toggleTagInDocument: ()=>{},
    createNewDocument: ()=>{},
    deleteDocument: ()=>{},
    shareDocument: ()=>{},
    jumpTo: ()=>{},
});

export default userContext;