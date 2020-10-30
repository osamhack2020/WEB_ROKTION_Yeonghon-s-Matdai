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
            targetUserTagIdError:false,
            targetUserShareError:false,
            mentionSent:false,
        };
    }

    resetState = () => {
        this.setState({
            targetUser:null,
            targetUserTagIdError:false,
            targetUserShareError:false,
            mentionSent:false,
        })
    }

    handleInputChange = (_,data) => {
        this.setState({
            targetUser:data.value,
            targetUserTagIdError:false,
            targetUserShareError:false,
            mentionSent:false,
        });
    }

    validateInput = (targetDoc) => {
        const targetUser = this.state.targetUser;
        if(!/^[0-9]{2}-[0-9]{5,8}$/.test(targetUser)){
            this.setState({
                targetUserTagIdError:true,
                targetUserShareError:false,
                mentionSent:false,
            })
            return false;
        }
        else {
            // 여기서 이미 문서가 공유된 군번인지 체크해야됨
            if (targetDoc.admin === targetUser ||
                targetDoc.shareOption.director.includes(targetUser) ||
                targetDoc.shareOption.editor.includes(targetUser) ||
                targetDoc.shareOption.viewer.includes(targetUser)) {
                    this.setState({
                        targetUserTagIdError:false,
                        targetUserShareError:false,
                        mentionSent:true,
                    })
                    return true;
                }
            this.setState({
                targetUserTagIdError:false,
                targetUserShareError:true,
                mentionSent:false,
            })
            return false;
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
                            this.state.targetUserTagIdError ?
                            "잘못된 군번입니다!" :
                            this.state.targetUserShareError ?
                            "공유되지 않은 유저입니다." :
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
                                const targetDoc = context.documents.find(doc => (doc.id === this.props.docid))
                                if(this.validateInput(targetDoc)){
                                    const docId = targetDoc.dbId;
                                    const pageId = this.props.page;
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