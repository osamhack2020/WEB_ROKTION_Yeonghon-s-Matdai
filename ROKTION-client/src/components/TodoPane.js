import React, { Component } from 'react';
import userContext from './UserContext';
import {
    Container,
    List,
    Button,
    Icon,
    Segment,
    Grid,
    Input, } from 'semantic-ui-react'

class TodoPane extends Component {

    constructor(props){
        super(props)
        this.state = {
            newTodoContent: "",
        };
    }

    handleInputChange = (e, data) => {
        this.setState({
            [e.target.name]:data.value,
        });
    }

    render() {
        return (
            <>
            <Container style={{height:"8vh"}}>
                <Input
                name='newTodoContent'
                placeholder='메모 입력...'
                label={
                    <Button
                        icon='plus'
                        content='메모 추가'
                        onClick={() => {
                            this.context.createNewTodo(this.state.newTodoContent)
                            this.setState({
                                newTodoContent:"",
                            })
                            }
                        }
                    />
                }
                labelPosition='right'
                value={this.state.newTodoContent}
                onChange={this.handleInputChange}
                style={{
                    padding:"11px 15px 5px 15px",
                    width:"100%"}}
                />
            </Container>
            <Container
                style={{
                    overflow:'auto',
                    height:"80vh"
                }}>
                <List>
                <userContext.Consumer>
                { value => {
                    console.log('value:',value)
                    
                    return value.todoList.map(
                        todo => (
                            <List.Item key={todo.id}>
                                <Segment>
                                <Grid verticalAlign='middle'>
                                <Grid.Row columns='equal'>
                                <Grid.Column width={1}>
                                <Icon
                                    todoId={todo.id}
                                    name='check'
                                    size='large'
                                    style={{
                                        color:'gray',
                                        opacity:".3",
                                        cursor:"pointer",}}
                                    onClick={(_,data)=>{this.context.removeTodo(data.todoId)}}/>
                                </Grid.Column>
                                <Grid.Column style={{paddingLeft:'15px'}}>
                                <div style={{lineHeight:"20px", overflowWrap:"break-word"}}>
                                {todo.content}
                                </div>
                                </Grid.Column>
                                </Grid.Row>
                                </Grid>
                                </Segment>
                            </List.Item>
                        )
                    )
                }}
                </userContext.Consumer>
                </List>
            </Container>
            </>
        );
    }
}

TodoPane.contextType = userContext;
export default TodoPane;