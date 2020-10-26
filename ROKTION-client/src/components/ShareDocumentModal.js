import React, { Component } from 'react';
import {
    Container,
    Input,
    Button,
    Grid,
    Modal,
    Header,
} from 'semantic-ui-react'

class ShareDocumentModal extends Component {
    constructor(props){
        super(props);
        this.state = {
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

    resetState = () => {
        this.setState({
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
        return (
            <Modal
                closeIcon
                closeOnDimmerClick={false}
                closeOnEscape={false}
                dimmer='inverted'
                onClose={()=>{this.resetState(); this.props.toggleModal(-1)}}
                open={this.props.open}
                style={{width:"500px", height:"150px", textAlign:'center'}}>
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
                            size='small'
                            placeholder='ID(군번)'
                            error={this.state.targetUserError}
                            onChange={this.handleInputChange}
                            style={{width:'300px'}}
                        />
                        <Button
                            color='teal'
                            content='공유'
                            style={{marginLeft:'3px', padding:"10px"}}
                            onClick={()=>{
                                if(this.validateInput())
                                this.props.shareDocument(this.state.targetUser, this.props.docid, "임시")
                            }}/>
                        </Container>
                        </Grid.Row>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default ShareDocumentModal;