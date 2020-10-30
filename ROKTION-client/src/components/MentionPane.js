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
                            const doc = context.documents.find(doc => (doc.dbId === mention.docDbId));
                            if (doc === undefined) return <></>; //문서 삭제됨
                            //const pageIndex = doc.documentContent.findIndex(page => (page.dbId === mention.pageDbId))
                            // if (pageIndex === -1) return <></>; // 페이지 삭제됨

                            //page DbId 추가 전 임시!
                            const pageIndex = 0;
                            
                            return(
                                <List.Item
                                    key={mention.id}
                                    onClick={
                                        ()=>{this.context.jumpTo(doc.id, pageIndex)}
                                    }
                                >
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
                                            <b> {doc.title}:{mention.pageDbId}</b>에 당신을 언급했습니다.
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
                            )
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