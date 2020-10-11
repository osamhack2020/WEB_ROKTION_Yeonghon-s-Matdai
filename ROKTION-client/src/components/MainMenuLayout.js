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
    Popup,
    Form,
    Dropdown,
} from 'semantic-ui-react';

class MainMenuLayout extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchKeyword: "",
            newTagName: "",
            newTagColor: "",
            filterAllTags:false,
            showAllTags:false,
            tags:props.tags.map(
                tag=>(
                    {id:tag.id, filter:true}
                    )
                ),
        };
    }

    handleTagFilterChange = (id) => {
        const tags = this.state.tags;
        this.setState({
            tags: tags.map(
                tag => {
                    if (tag.id === id) { return {...tag, filter:!tag.filter}; }
                    else return tag;
                }
            )
        })
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    toggleFilterAllTags = () => {
        const val = this.state.filterAllTags;
        const tags = this.state.tags;
        this.setState({
            filterAllTags:!val,
            tags: tags.map(
                tag => ({...tag, filter:val})
            )
        })
    }

    toggleShowAllTags = () => {
        const val = this.state.showAllTags;
        this.setState({
            showAllTags:!val,
        });
    }

    // <Label key={"Tag"+tag.id} color={tag.color}>{tag.name}</Label>
    render(){
        const tagFilteredList = this.props.documents.filter(
            document => (
                document.tags.some(tag=>(this.state.tags.find(l=>l.id===tag)).filter) && document
            )
        );
        
        const keywordFilteredList = tagFilteredList.filter(
            document => document.title.indexOf(this.state.searchKeyword) > -1
        );
        
        const documentList = keywordFilteredList.map(
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
                            <div style={{paddingTop:"10px", fontSize:"30px"}}>
                                {document.title}
                            </div>
                            <div style={{paddingTop:"10px"}}>
                            {this.props.tags.map(
                                tag => (
                                    (document.tags.includes(tag.id)) &&
                                    <Button
                                        as={Label}
                                        key={"Tag"+tag.id}
                                        color={tag.color}
                                        style={{opacity:this.state.tags.find(l=>l.id===tag.id).filter?1:0.2,}}
                                        onClick={()=>{console.log("LABEL")}}>
                                        {tag.name}
                                    </Button>
                                )
                            )}
                            </div>
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
                        name="searchKeyword" 
                        onChange={this.handleInputChange}
                        placeholder="문서제목으로 검색"/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:"0px"}} columns='equal'>
                    <Grid.Column style={{
                                minWidth:"90px",
                                maxWidth:"90px",
                                paddingRight:"5px",
                                marginBottom:"5px"}}>
                        <Button
                            as={Label}
                            key={"AllTags"}
                            color="black"
                            onClick={this.toggleFilterAllTags}
                            style={{opacity:this.state.filterAllTags?0.2:1,}}>
                            모든 태그
                        </Button>
                    </Grid.Column>
                    <Grid.Column
                        style={{
                            paddingLeft:"0px",
                            lineBreak:"strict",
                            height:"auto",
                            maxHeight:this.state.showAllTags?null:"30px",
                            overflow:this.state.showAllTags?null:"hidden"}}>
                        {this.props.tags.map(
                            tag => (
                                <Button
                                    as={Label}
                                    key={"Tag"+tag.id}
                                    name={tag.id}
                                    color={tag.color}
                                    onClick={(_,data)=>{this.handleTagFilterChange(data.name);}}
                                    style={{
                                        opacity:this.state.tags.find(l=>l.id===tag.id).filter?1:0.2,
                                        margin:"0px 0.285714em 5px 0px",}}>
                                    {tag.name}
                                </Button>
                            )
                        )}
                        <div>
                            <Popup
                                key={"AddTag"}
                                on='click'
                                pinned
                                position="bottom center"
                                trigger={<Button
                                            as={Label}
                                            key={"AddNewTag"}
                                            color="grey"
                                            style={{
                                                textAlign:"center",
                                                margin:"0px 0.285714em 5px 0px",}}>
                                            <Icon name='plus'/>태그추가
                                        </Button>}>
                                    <Form>
                                    <Form.Input 
                                        name='newTagName'
                                        label='이름'
                                        placeholder='태그 이름'
                                        onChange={this.handleInputChange}
                                        error={!/^[0-9A-Z]$/.test(this.state.newTagName)}/>
                                    <Form.Input 
                                        name='newTagColor'
                                        label='색상'
                                        placeholder='#FFFFFF'
                                        onChange={this.handleInputChange}
                                        error={!/^#[0-9A-F]{6}$/.test(this.state.newTagColor)}/>
                                    <Button size='small' type='submit'>Submit</Button>
                                    </Form>
                            </Popup>
                            <Popup
                                key={"DeleteTag"}
                                on='click'
                                pinned
                                position="bottom center"
                                trigger={<Button
                                            as={Label}
                                            key={"AddNewTag"}
                                            color="grey"
                                            style={{
                                                textAlign:"center",
                                                margin:"0px 0.285714em 5px 0px",}}>
                                            <Icon name='plus'/>태그삭제
                                        </Button>}>
                                    <Form>
                                    <Form.Input 
                                        name='newTagName'
                                        label='이름'
                                        placeholder='태그 이름'
                                        onChange={this.handleInputChange}/>
                                    <Form.Input 
                                        name='newTagColor'
                                        label='색상'
                                        placeholder='#FFFFFF'
                                        onChange={this.handleInputChange}
                                        error={!/^#[0-9A-F]{6}$/.test(this.state.newTagColor)}/>
                                    <Button size='small' type='submit'>Submit</Button>
                                    </Form>
                            </Popup>
                        </div>
                    </Grid.Column>
                    <Button
                        as={Grid.Column}
                        basic
                        icon
                        onClick={this.toggleShowAllTags}
                        style={{
                            boxShadow:"none",
                            marginLeft:"15px",
                            marginRight:"30px",
                            padding:"1px",
                            minWidth:"32px",
                            maxWidth:"32px",}}>
                            <Icon color='black' size='big' name={this.state.showAllTags?'angle up':'angle down'}/>
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