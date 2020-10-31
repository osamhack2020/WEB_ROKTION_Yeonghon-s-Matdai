import React, { Component } from 'react';
import SignUpModal from './SignUpModal'
import logo from '../img/fittedLogo.png';
import {
    Container,
    Segment,
    Form,
    Button,
    List,
    Image,
  } from 'semantic-ui-react'

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:'',
            password:'',
        }
    }

    handleChange = (e,data) => {
        //console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]:data.value,
        });
    }

    render() {
        return (
            <>
            <div style={{
                    position: 'absolute',
                    left:"50%",
                    top:"50%",
                    transform: "translate(-50%,-50%)",}}>
                <Image src={logo} alt="Logo" style={{width:"400px"}}/>
                <Segment style={{
                    maxWidth:"400px",
                    minWidth:"400px",
                    marginTop:"0px",
                    paddingBottom:'4px',}}>
                    <Form>
                    <Form.Input
                        name='id'
                        placeholder='아이디'
                        onChange={this.handleChange}/>
                    <Form.Input
                        name='password'
                        placeholder='비밀번호'
                        type='password'
                        onChange={this.handleChange}/>
                    <Container
                        as={Form.Field} 
                        textAlign='center'
                        style={{marginBottom:"5px"}}>
                    <Button
                        fluid
                        type='submit'
                        onClick={() => this.props.handleLogin(this.state.id, this.state.password)}
                    >로그인</Button>
                    </Container>
                    <Container as={Form.Field} textAlign='center'>
                        <List
                            divided horizontal
                            style={{opacity:.5, cursor:"pointer"}}
                        >
                            <List.Item onClick={()=>{console.log("아이디찾기")}}>아이디 찾기</List.Item>
                            <List.Item onClick={()=>{console.log("비밀번호찾기")}}>비밀번호 찾기</List.Item>
                            <SignUpModal createNewUser={this.props.createNewUser}/>
                        </List>
                    </Container>
                    </Form>
                </Segment>
                
            </div>
            </>
        );
    }
}

export default LoginPage;