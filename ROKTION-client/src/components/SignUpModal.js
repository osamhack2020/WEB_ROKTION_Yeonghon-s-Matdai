import React, { Component } from 'react';
import {
    Modal,
    Button,
    List,
    Form,
    Icon,
    Grid,
  } from 'semantic-ui-react'


class SignUpModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSigningUp:false,
            isSignedUp:false,
            id:null,
            idError:false,
            password:null,
            passwordError:false,
            passwordCheck:null,
            passwordCheckError:false,
            name:null,
            nameError:false,
            regiment:null,
            regimentError:false,
            rank:null,
            rankError:false,
            dateOfBirth:null,
            dateOfBirthError:false,
            email:null,
            emailError:false,
            phoneNumber:null,
            phoneNumberError:false,
        }
    }

    resetUserData = () => {
        this.setState({
            isSignedUp:false,
            id:null,
            idError:false,
            password:null,
            passwordError:false,
            passwordCheck:null,
            passwordCheckError:false,
            name:null,
            nameError:false,
            regiment:null,
            regimentError:false,
            rank:null,
            rankError:false,
            dateOfBirth:null,
            dateOfBirthError:false,
            email:null,
            emailError:false,
            phoneNumber:null,
            phoneNumberError:false,
        })
    }

    validateUserData = () => {
        let isValid = true;
        this.setState({
            idError:false,
            passwordError:false,
            passwordCheckError:false,
            nameError:false,
            regimentError:false,
            rankError:false,
            dateOfBirthError:false,
            emailError:false,
            phoneNumberError:false,
        })

        if(!/^[0-9]{2}-[0-9]{5,8}$/.test(this.state.id)){
            this.setState({idError:true});
            isValid = false;
        }
        if(
            this.state.password === null ||
            !/^\S{6,}$/.test(this.state.password)){
                this.setState({passwordError:true});
                isValid = false;
        }
        if(
            this.state.passwordCheck === null ||
            this.state.password !== this.state.passwordCheck){
                this.setState({passwordCheckError:true});
                isValid = false;
        }
        if(
            this.state.name === null ||
            !/^\S+$/.test(this.state.name)){
                this.setState({nameError:true});
                isValid = false;
        }
        if(
            this.state.regiment === null ||
            !/^[\S\s]+$/.test(this.state.regiment)){
                this.setState({regimentError:true});
                isValid = false;
        }
        if(this.state.rank === null){
            this.setState({rankError:true});
            isValid = false;
        }
        if(!/^[0-9]{6}$/.test(this.state.dateOfBirth)){
            this.setState({dateOfBirthError:true});
            isValid = false;
        }
        if(!/^[\S]+@[\S]+\.[\S]+$/.test(this.state.email)){
            this.setState({emailError:true});
            isValid = false;
        }
        if(!/^(010)[0-9]{8}$/.test(this.state.phoneNumber)){
            this.setState({phoneNumberError:true});
            isValid = false;
        }

        return isValid;
    }

    handleUserDataChange = (e, data) => {
        this.setState({
            [e.target.name]: data.value,
        })
    }

    handleRankChange = (_,data) => {
        this.setState({
            rank: data.value,
        })
    }

    createNewUser = () => {
        const newUser = {
            id:this.state.id,
            password:this.state.password,
            name:this.state.name,
            regiment:this.state.regiment,
            rank:this.state.rank,
            dateOfBirth:this.state.dateOfBirth,
            email:this.state.email,
            phoneNumber:this.state.phoneNumber
        }
        this.props.createNewUser(newUser);
    }

    render() {
        const ranks = [
            {key:0, text:'이병', value:'이병'},
            {key:1, text:'일병', value:'일병'},
            {key:2, text:'상병', value:'상병'},
            {key:3, text:'병장', value:'병장'},
            {key:4, text:'하사', value:'하사'},
            {key:5, text:'중사', value:'중사'},
            {key:6, text:'상사', value:'상사'},
            {key:7, text:'원사', value:'원사'},
            {key:8, text:'준위', value:'준위'},
            {key:9, text:'소위', value:'소위'},
            {key:10, text:'중위', value:'중위'},
            {key:11, text:'대위', value:'대위'},
            {key:12, text:'소령', value:'소령'},
            {key:13, text:'중령', value:'중령'},
            {key:14, text:'대령', value:'대령'},
            {key:15, text:'준장', value:'준장'},
            {key:16, text:'소장', value:'소장'},
            {key:17, text:'중장', value:'중장'},
            {key:18, text:'대장', value:'대장'},
            {key:19, text:'생도', value:'생도'},
            {key:20, text:'후보생', value:'후보생'},
            {key:21, text:'군무원', value:'군무원'},
        ]
        
        return (
            <>
            <Modal
                dimmer="inverted"
                closeOnEscape={false}
                closeOnDimmerClick={false}
                trigger={<List.Item content='회원가입'/>}
                onClose={() => {this.setState({isSigningUp:false})}}
                onOpen={() => {this.setState({isSigningUp:true})}}
                open={this.state.isSigningUp}
                style={{width:'700px'}}
            >
                <Modal.Header>회원가입</Modal.Header>
                <Modal.Content>
                <Form>
                    <Form.Input
                        name='id'
                        fluid
                        label={
                            this.state.idError ? 
                            '아이디가 형식에 맞지 않습니다. (잘못된 군번입니다)' :
                            '아이디 (본인의 군번)'}
                        onChange={this.handleUserDataChange}
                        error={this.state.idError}
                        placeholder='아이디' />
                    <Form.Group fluid>
                    <Form.Input
                        name='password'
                        label={
                            this.state.passwordError ?
                            '비밀번호가 형식에 맞지 않습니다. (6자 이상)':
                            '비밀번호 (6자 이상)'}
                        type='password'
                        width={8}
                        onChange={this.handleUserDataChange}
                        error={this.state.passwordError}
                        placeholder='비밀번호' />
                    <Form.Input
                        name='passwordCheck'
                        label={
                            this.state.passwordCheckError ?
                            '비밀번호와 비밀번호 확인이 일치하지 않습니다.' :
                            '비밀번호 확인'}
                        type='password'
                        width={8}
                        onChange={this.handleUserDataChange}
                        error={this.state.passwordCheckError}
                        placeholder='비밀번호 확인' />
                    </Form.Group>
                    <Form.Group fluid>
                    <Form.Input
                        name='name'
                        label={
                            this.state.nameError ?
                            '성명을 기입해주세요.' :
                            '성명'
                        }
                        width={8}
                        onChange={this.handleUserDataChange}
                        error={this.state.nameError}
                        placeholder='성명' />
                    <Form.Select
                        name='rank'
                        label={
                            this.state.rankError ?
                            '계급을 선택해주세요.' :
                            '계급'
                        }
                        width={7}
                        onChange={this.handleRankChange}
                        error={this.state.rankError}
                        options={ranks}
                        placeholder='계급'/>
                    </Form.Group>
                    <Form.Input
                        name='regiment'
                        label={
                            this.state.regimentError ?
                            '소속부대를 기입해주세요. (중대급까지 기재)' :
                            '소속부대 (중대급까지 기재)'}
                        onChange={this.handleUserDataChange}
                        error={this.state.regimentError}
                        placeholder='소속부대' />
                    <Form.Input
                        name='dateOfBirth'
                        fluid
                        label={
                            this.state.dateOfBirthError ?
                            '잘못된 생년월일입니다. (주민등록번호 앞 6자리)':
                            '생년월일 (주민등록번호 앞 6자리)'}
                        onChange={this.handleUserDataChange}
                        error={this.state.dateOfBirthError}
                        placeholder='생년월일' />
                    <Form.Input
                        name='email'
                        fluid
                        label={
                            this.state.emailError ?
                            '잘못된 이메일입니다.' :
                            '이메일'}
                        onChange={this.handleUserDataChange}
                        error={this.state.emailError}
                        placeholder='이메일' />
                    <Form.Input
                        name='phoneNumber'
                        fluid
                        label={
                            this.state.phoneNumberError ?
                            '잘못된 전화번호입니다.':
                            '전화번호 ( - 없이 입력)'}
                        onChange={this.handleUserDataChange}
                        error={this.state.phoneNumberError}
                        placeholder='전화번호' />
                </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                    color='green'
                    content="회원가입"
                    onClick={() => {
                        if(this.validateUserData()){
                            this.createNewUser();
                            this.setState({isSignedUp:true})
                        }
                    }}
                    />
                    <Button
                    color='red'
                    content='취소'
                    onClick={() => {
                        this.resetUserData();
                        this.setState({
                            isSignedUp:false,
                            isSigningUp:false})
                        }
                    }
                    />
                </Modal.Actions>
            </Modal>

            <Modal
            dimmer="inverted"
            closeOnEscape={false}
            closeOnDimmerClick={false}
            onClose={() => {this.setState({isSignedUp:false})}}
            onOpen={() => {this.setState({isSignedUp:true})}}
            open={this.state.isSignedUp}
            >
                <Modal.Content>
                    <Grid
                        as={Modal.Description}
                        style={{padding:"10px 25px 10px 25px"}}>
                        <Grid.Row
                            columns='equal'
                            verticalAlign='middle'>
                            <Grid.Column width={3}>
                            <Icon.Group size='massive'>
                                <Icon name='user'/>
                                <Icon
                                    corner
                                    color='green'
                                    name='check'/> 
                            </Icon.Group>
                            </Grid.Column>
                            <Grid.Column>
                                <h1 style={{marginBottom:"5px"}}>
                                    {this.state.name}님, 환영합니다!
                                </h1>
                                <div style={{fontSize:"20px", marginTop:"0px", marginBottom:"5px"}}>
                                    ROKTION 국군정보체계에 성공적으로 가입되었습니다.
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:"0px", paddingBottom:"5px"}}>
                            <Button
                                fluid
                                size='small'
                                color='green'
                                content='로그인하러 가기'
                                onClick={()=>{
                                    this.resetUserData();
                                    this.setState({
                                        isSignedUp:false,
                                        isSigningUp:false})
                                    }
                                }
                            />
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
            </>
        );
    }
}

export default SignUpModal;