import React, { Component } from 'react';
import userContext from './UserContext';
import {
    Container,
    List,
    Segment,
    Icon, } from 'semantic-ui-react'

class MentionPane extends Component {

    constructor(props){
        super(props)
        this.state = {
        };
    }

    validateAndGetDocumentTitle = (id) => {
        const doc = this.context.documents.find(doc => (doc.id === id))
        if (doc === undefined){
            //this.removeMention();
            return null;
        }
        else return doc.title
    }

    render() {
        return (
            <>
            <Container
                style={{
                    overflow:'auto',
                    height:"88vh"
                }}>
                <List>
                <userContext.Consumer>
                { context => {
                    return context.mentionList.map(
                        mention => {
                            const title = this.validateAndGetDocumentTitle(mention.docid);
                            return title === null ? <></> :
                                <List.Item key={mention.id} onClick={()=>{this.context.jumpTo(mention.docid, mention.pageIndex)}}>
                                    <Segment style={{paddingTop:"5px", paddingBottom:"5px"}}>
                                        <Container textAlign='right'>
                                            <Icon
                                                name='delete'
                                                onClick={()=>{this.context.removeMention(mention.id)}}
                                                style={{
                                                    cursor:"pointer",
                                                    transform: "translate(7.5px,0)",
                                                    marginRight:"0px"
                                                }}
                                            />
                                        </Container>
                                        <Container style={{cursor:"pointer"}}>
                                            <b>{mention.mentioningUserRank} {mention.mentioningUserName}</b>님이
                                            <b> {title}</b>에 당신을 언급했습니다.
                                        </Container>
                                        <Container
                                            textAlign='right'
                                            style={{
                                                color:'grey',
                                                opacity:'.3',
                                                transform: "translate(5.5px,0)",
                                            }}
                                        >{mention.timeOfMention}
                                        </Container>
                                    </Segment>
                                </List.Item>
                        }
                    )
                }}
                </userContext.Consumer>
                </List>
            </Container>
            </>
        );
    }
}

MentionPane.contextType = userContext;
export default MentionPane;