import React, { Component } from 'react';
import DocumentPageSidebar from './DocumentPageSidebar';
import DocumentPageLayout from './DocumentPageLayout';
import {Sidebar,} from 'semantic-ui-react'

// TODO: document id 없을경우 예외처리

class DocumentPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let info = this.props.information
        let selectedDocument= info.documents.find(doc=>doc.id===info.selectedDocumentId);
        {/* if (documentContent === undefined) do something */}
        return (
            <Sidebar.Pushable className="DocumentPage" style={{overflow:'visible'}}>
                <DocumentPageSidebar documents = {info.documents} toMainMenu={this.props.toMainMenu}/>
                <DocumentPageLayout
                handleLogout = {this.props.handleLogout}
                document = {selectedDocument}/>
            </Sidebar.Pushable>
        );
    }
}

export default DocumentPage;