import React, { Component } from 'react';
import DocumentPageSidebar from './DocumentPageSidebar';
import DocumentPageLayout from './DocumentPageLayout';
import userContext from './UserContext';
import {Sidebar,} from 'semantic-ui-react'


// TODO: document id 없을경우 예외처리
///* if (documentContent === undefined) do something */

class DocumentPage extends Component {
    render() {
        return (
            <Sidebar.Pushable className="DocumentPage" style={{overflow:'visible'}}>
                <DocumentPageSidebar/>
                <DocumentPageLayout/>
            </Sidebar.Pushable>
        );
    }
}

DocumentPage.contextType = userContext;
export default DocumentPage;