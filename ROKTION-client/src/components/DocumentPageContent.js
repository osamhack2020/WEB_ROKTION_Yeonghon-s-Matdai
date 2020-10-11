import React, { Component } from 'react';
import {
    Container,
    Pagination,
  } from 'semantic-ui-react'

class DocumentPageContent extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <>
            <div style={{minHeight:"500px", maxHeight:"500px"}}>
                {this.props.content}
            </div>
            </>
        );
    }
}

export default DocumentPageContent;