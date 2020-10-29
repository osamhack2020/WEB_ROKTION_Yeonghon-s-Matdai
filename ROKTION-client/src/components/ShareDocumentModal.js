import React, { Component } from 'react';
import {
    Container,
    Input,
    Button,
    Grid,
    Modal,
    Header,
    Dropdown,
} from 'semantic-ui-react'
import userContext from './UserContext';

class ShareDocumentModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            authority:'viewer',
            targetUser:null,
            targetUserError:false,
            documentShared:false,
        };
    }

    handleInputChange = (_,data) => {
        this.setState({
            targetUser:data.value,
            targetUserError:false,
            documentShared:false,
        });
    }

    handleAuthorityChange = (_, data) => {
        console.log(data);
        this.setState({
            authority:data.value,
            targetUserError:false,
            documentShared:false,
        });
    }

    resetState = () => {
        this.setState({
            authority:'viewer',
            targetUser:null,
            targetUserError:false,
            documentShared:false,
        })
    }

    validateInput = () => {
        const targetUser = this.state.targetUser;
        if(!/^[0-9]{2}-[0-9]{5,8}$/.test(targetUser)){
            this.setState({
                targetUserError:true,
                documentShared:false,
            })
            return false;
        }
        else{
            this.setState({
                targetUserError:false,
                documentShared:true,
            })
            return true;
        }
    }

    render() {
        const authorityOption = [
            {key:'viewer', text:'열람',value:'viewer'},
            {key:'editor', text:'열람 및 수정',value:'editor'},
            {key:'director', text:'관리자',value:'director'},
        ]

        return (
            <Modal
                closeIcon
                closeOnDimmerClick={true}
                closeOnEscape={false}
                dimmer='inverted'
                onClose={()=>{this.resetState(); this.props.toggleModal(-1)}}
                open={this.props.open}
                style={{width:"525px", height:"150px", textAlign:'center'}}>
                <Modal.Content>
                    <Modal.Description style={{paddingTop:"20px"}}>
                    <Header><h2>
                        {
                        this.state.targetUserError ?
                        "잘못된 군번입니다!" :
                        this.state.documentShared ?
                        <div>유저 {this.state.targetUser}에게 공유되었습니다!</div>:
                        "이 문서를 누구와 공유할까요?"
                        }
                        </h2></Header>
                    <Grid.Row columns='equal' style={{paddingTop:"0px"}}>
                        <Container as={Grid.Column} style={{padding:"0px"}}>
                        <Input
                            name='targetUser'
                            size='small'
                            placeholder='ID(군번)'
                            error={this.state.targetUserError}
                            onChange={this.handleInputChange}
                            style={{width:'300px'}}
                            label={
                                <Dropdown
                                    name='authority'
                                    onChange={this.handleAuthorityChange}
                                    options={authorityOption}
                                    defaultValue={authorityOption[0].value}/>
                            }
                        />
                        <userContext.Consumer>
                        { context => (
                        <Button
                            color='teal'
                            content='공유'
                            style={{marginLeft:'3px', padding:"10px"}}
                            onClick={()=>{
                                if(this.validateInput())
                                context.shareDocument(this.state.targetUser, this.props.docid, this.state.authority)
                            }}/>
                        )}
                        </userContext.Consumer>
                        </Container>
                        </Grid.Row>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default ShareDocumentModal;