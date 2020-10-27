import React, { Component } from 'react';
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
            id:4, // !!!!!!!!!!!!!!!!!!!!!!!!!!!! id와 todoList는 임시처리
            todoList: [
                { id:0, content:"hello"},
                { id:1, content:"hello"},
                { id:2, content:"hello"},
                { id:3, content:"hello"},
            ]
        };
    }

    handleInputChange = (e, data) => {
        this.setState({
            [e.target.name]:data.value,
        });
    }

    createNewTodo = () => {
        let list = this.state.todoList
        const val = this.state.id
        const content = this.state.newTodoContent
        if (content.length <= 0) return;

        this.setState({
            todoList: list.concat({id:val, content:content}),
            id:val+1,
            newTodoContent: "",
        })
    }

    removeTodo = (id) => {
        let list = this.state.todoList
        const idx = list.findIndex(todo => (todo.id === id));
        if (idx > -1){
            list.splice(idx, 1);
            this.setState({
                todoList:list,
            })
        }
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
                        onClick={this.createNewTodo}/>}
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
                {this.state.todoList.map(
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
                                onClick={(_,data)=>{this.removeTodo(data.todoId)}}/>
                            </Grid.Column>
                            <Grid.Column style={{paddingLeft:'15px'}}>
                            <div style={{lineHeight:"20px"}}>
                            {todo.content}
                            </div>
                            </Grid.Column>
                            </Grid.Row>
                            </Grid>
                            </Segment>
                        </List.Item>
                    )
                )}
                </List>
            </Container>
            </>
        );
    }
}

export default TodoPane;