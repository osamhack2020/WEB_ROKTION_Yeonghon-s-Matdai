import React, { Component } from 'react';

class DocumentPageContent extends Component {
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