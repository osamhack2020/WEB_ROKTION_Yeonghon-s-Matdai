import React, { Component } from 'react';
import {
    Popup,
    Container,
    Input,
    Button,
    Grid,
    Icon,
  } from 'semantic-ui-react'
import userContext from './UserContext';

class MentionUserPopup extends Component {
    constructor(props){
        super(props);
        this.state = {
            targetUser:null,
            targetUserError:false,
            mentionSent:false,
        };
    }

    resetState = () => {
        this.setState({
            targetUser:null,
            targetUserError:false,
            mentionSent:false,
        })
    }

    handleInputChange = (_,data) => {
        this.setState({
            targetUser:data.value,
            targetUserError:false,
            mentionSent:false,
        });
    }

    validateInput = () => {
        const targetUser = this.state.targetUser;
        if(!/^[0-9]{2}-[0-9]{5,8}$/.test(targetUser)){
            this.setState({
                targetUserError:true,
                mentionSent:false,
            })
            return false;
        }
        else{
            this.setState({
                targetUserError:false,
                mentionSent:true,
            })
            return true;
        }
    }

    render() {
        return (
            <Popup
                trigger={
                    <Button 
                    color='grey' 
                    icon={
                    <Icon.Group>
                        <Icon name='user'/>
                        <Icon inverted corner name='at'/>
                    </Icon.Group>}/>
                }
                content={
                    <Grid style={{width:'230px'}}>
                        <Grid.Row columns='equal'>
                        <Container as={Grid.Column} style={{fontSize:"17px"}} textAlign='center'>
                            {
                            this.state.targetUserError ?
                            "잘못된 군번입니다!" :
                            this.state.mentionSent ?
                            <div>유저 {this.state.targetUser}을 <br/> 이 페이지로 언급했습니다!</div>:
                            <div>이 문서의 {this.props.page+1} 페이지에 <br/> 누구를 언급할래요?</div>
                            }
                        </Container>
                        </Grid.Row>
                        <Grid.Row columns='equal' style={{paddingTop:"0px"}}>
                        <Container as={Grid.Column} style={{padding:"0px"}} textAlign='center'>
                        <Input
                            size='small'
                            placeholder='ID(군번)'
                            error={this.state.targetUserError}
                            onChange={this.handleInputChange}
                            style={{width:'150px'}}
                        />
                        <userContext.Consumer>
                        { context => (
                        <Button
                            color='teal'
                            content='언급'
                            style={{marginLeft:'3px', padding:"10px"}}
                            onClick={()=>{
                                if(this.validateInput()){
                                    const targetDoc = context.documents.find(doc => (doc.id === this.props.docid))
                                    const docId = targetDoc.dbId;
                                    const pageId = targetDoc.documentContent[this.props.page].dbId
                                    context.createNewMention(this.state.targetUser, docId, pageId);
                                }
                            }}/>
                        )}
                        </userContext.Consumer>
                        </Container>
                        </Grid.Row>
                    </Grid>
                }
                on='click'
                onClose={this.resetState}
                position='top right'
            />
        );
    }
}

export default MentionUserPopup;