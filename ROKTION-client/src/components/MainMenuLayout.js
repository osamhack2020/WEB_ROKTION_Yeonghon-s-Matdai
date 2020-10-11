import React, { Component } from 'react';
import UserIcon from './UserIcon';
import {
    Grid,
    Icon,
    Container,
    Divider,
    Menu,
    Input,
    Label,
    Button,
} from 'semantic-ui-react';

class MainMenuLayout extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let documentList = this.props.documents.map(
            document => (
                <Menu.Item onClick={document.onClick}>
                <Grid columns={2}>
                    <Grid.Row columns='equal'>
                        <Grid.Column style={{minWidth:"140px", maxWidth:"140px"}}>
                            <Container textAlign='center'>
                                <Icon name='square' size='massive' color='blue'/>
                            </Container>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{fontSize:"20px"}}>
                                <b>{document.title}</b>
                            </div>
                            <Divider/>
                            <div>{document.description}</div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Menu.Item>
            )
        )
        return(
            <>
            <div style={{padding:'10px 0px 0px 20px',
                                width:"90%",
                                minWidth:"500px",
                                maxWidth:"1000px"}}>
            <Grid>
                <Grid.Row columns='equal'>
                    <Container
                        as={Grid.Column}
                        textAlign='left'>
                        <div style={{fontSize:"25px"}}>ROKTION</div>
                        <div style={{fontSize:"15px"}}>국군정보공유체계</div>
                    </Container>
                    <Container as={Grid.Column}
                                textAlign='right'>
                        <div>{this.props.userInfo.regiment}</div>
                        <div>{this.props.userInfo.rank} {this.props.userInfo.name}</div>
                    </Container>
                    <Grid.Column style={{paddingLeft:"0px", minWidth:"45px", maxWidth:"45px"}}>
                        <UserIcon handleLogout={this.props.handleLogout}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:"0px", paddingBottom:"0px"}}>
                    <Divider as={Grid.Column} style={{marginLeft:"20px", marginRight:"20px"}}/>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                    <Input
                        fluid
                        placeholder="문서제목으로 검색"/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:"0px"}} columns='equal'>
                    <Grid.Column style={{whiteSpace:"nowrap", overflow:"hidden"}}>
                        <Label color='green'>진행중</Label>
                        <Label color='grey'>예정됨</Label>
                        <Label color='violet'>완료됨</Label>
                        <Label color='teal'>인수인계</Label>
                        <Label color='brown'>문서</Label>
                        <Label color='pink'>상황병</Label>
                        <Label color='red'>아아아아아아아아아아아아아아아아아아아아아아아아주 긴 태그</Label>
                        <Label color='black'>넘어갈까 마알까</Label>
                    </Grid.Column>
                    <Button
                        as={Grid.Column}
                        basic
                        icon
                        style={{
                            boxShadow:"none",
                            marginLeft:"15px",
                            marginRight:"30px",
                            padding:"1px",
                            minWidth:"32px",
                            maxWidth:"32px"}}>
                            <Icon color='black' size='big' name='angle down'/>
                    </Button>
                </Grid.Row>
                <Container
                    as={Grid.Row}
                    style={{overflow:'auto', maxHeight:"550px", paddingTop:"0px"}}>
                    <Menu vertical secondary fluid>{documentList}</Menu>
                </Container>
            </Grid>
            </div>
            </>
        );
    }
}

export default MainMenuLayout;