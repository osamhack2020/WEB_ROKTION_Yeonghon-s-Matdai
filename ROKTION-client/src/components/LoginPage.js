import React, { Component } from 'react';
import {
    Segment,
    Form,
    Button,
    Container,
  } from 'semantic-ui-react'

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:null,
            password:null,
        }
    }

    handleChange = (e,data) => {
        console.log(e.target.name, e.target.value)
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
                <div style={{textAlign:"center", fontSize:"25px"}}>
                    <b>ROKTION 국군정보공유체계</b>
                </div>
                <Segment style={{
                    maxWidth:"400px",
                    minWidth:"400px",}}>
                    <Form>
                    <Form.Input
                        label='ID'
                        name='id'
                        placeholder='ID'
                        onChange={this.handleChange}/>
                    <Form.Input
                        label='Password'
                        name='password'
                        placeholder='Password'
                        type='password'
                        onChange={this.handleChange}/>
                    <Button type='submit' onClick={this.props.handleLogin}>Login</Button>
                    <Button type='submit'>Forgot password?</Button>
                    </Form>
                </Segment>
                
            </div>
            </>
        );
    }
}

export default LoginPage;