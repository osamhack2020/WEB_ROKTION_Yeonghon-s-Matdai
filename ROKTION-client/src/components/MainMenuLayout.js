import React, { Component } from 'react';
import UserIcon from './UserIcon';
import {
    Grid,
    Icon,
    Container,
    Divider,
    Input,
    Label,
    Button,
    Popup,
    Form,
    List,
    Dropdown,
} from 'semantic-ui-react';

class MainMenuLayout extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchMode: "문서제목",
            searchKeyword: "",
            newTagName: "",
            newTagColor: "",
            filterAllTags:false,
            showAllTags:false,
            showSearchTab:false,
            tagDeleteMode:false,
            tagDeletePopup:-1,
            tagFilter:props.tags.map(
                tag=>(
                    {id:tag.id, filter:true}
                    )
                ),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const prevTagFilter = prevState.tagFilter;
        const nextTagFilter = nextProps.tags.map(
            tag=>{
                    let t = prevTagFilter.find(l=>l.id===tag.id);
                    return t !== undefined ? t : {id:tag.id, filter:true};
                }
            )

        return({
            tagFilter:nextTagFilter,
        })
    }

    handleTagFilterChange = (id) => {
        const tags = this.state.tagFilter;
        this.setState({
            tagFilter: tags.map(
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
        const tags = this.state.tagFilter;
        this.setState({
            tagDeleteMode:false, //태그 삭제 모드 해제
            tagDeletePopup:-1, //태그 삭제 팝업 해제
            filterAllTags:!val,
            tagFilter: tags.map(
                tag => ({...tag, filter:val})
            )
        })
    }
    
    toggleShowSearchTab = () => {
        const val = this.state.showSearchTab;
        this.setState({
            showSearchTab:!val,
        })
    }

    toggleShowAllTags = () => {
        const val = this.state.showAllTags;
        this.setState({
            showAllTags:!val,
        });
    }

    toggleTagDeleteMode = () => {
        const val = this.state.tagDeleteMode;
        const tags = this.state.tagFilter
        this.setState({
            tagDeleteMode:!val,
            // Tag필터링 전부 리셋
            filterAllTags:false,
            tagFilter: tags.map(
                tag => ({...tag, filter:true})
            )
        })
    }

    addNewTag = () => {
        const name = this.state.newTagName;
        const color = this.state.newTagColor;
        if (/^[\S\s]+$/.test(name) && 
            /^#[0-9A-F]{6}$/.test(color)){
            this.props.addNewTag(name,color);
            this.setState({
                newTagName:"",
                newTagColor:"",
            })
        }
    }

    deleteTag = (id) => {
        if(this.props.documents.every((doc) => (
            doc.tags.includes(id) ? false : true   
        ))){
            this.props.deleteTag(id);
        }
    }


    // <Label key={"Tag"+tag.id} color={tag.color}>{tag.name}</Label>
    render(){
        const tagFilteredList = this.props.documents.filter(
            document => (
                document.tags.some(tag=>(this.state.tagFilter.find(l=>l.id===tag)).filter) && document
            )
        );
        
        const keywordFilteredList = tagFilteredList.filter(
            document => document.title.indexOf(this.state.searchKeyword) > -1
        );
        
        const documentList = keywordFilteredList.map(
            document => (
                <List.Item key={"Doc"+document.id}>
                <Grid columns={2}>
                    <Grid.Row columns='equal'>
                        <Grid.Column style={{minWidth:"140px", maxWidth:"140px"}}>
                            <Container textAlign='center'>
                                <Icon
                                    onClick={document.onClick}
                                    name='square'
                                    size='massive'
                                    color='blue'
                                    style={{cursor:"pointer"}}/>
                            </Container>
                        </Grid.Column>
                        <Grid.Column>
                            <div
                                onClick={document.onClick}
                                style={{
                                    paddingTop:"15px",
                                    fontSize:"30px",
                                    cursor:"pointer",}}>
                                {document.title}
                            </div>
                            <div style={{paddingTop:"20px"}}>
                            {this.props.tags.map(
                                tag => (
                                    (document.tags.includes(tag.id)) &&
                                    <Button
                                        as={Label}
                                        key={"Tag"+tag.id}
                                        style={{
                                            opacity:this.state.tagFilter.find(l=>l.id===tag.id).filter?1:0.2,
                                            backgroundColor:tag.color,
                                            color:"white"}}
                                        onClick={()=>{console.log("LABEL")}}>
                                        {tag.name}
                                    </Button>
                                )
                            )}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </List.Item>
            )
        )

        // showSearchTab이 true일때만 렌더
        const searchTab = this.state.showSearchTab ? (
            <>
            <Grid.Row columns='equal'>
                    <Grid.Column
                        verticalAlign='middle'
                        style={{
                            minWidth:"100px",
                            maxWidth:"100px",
                            paddingRight:"0px"}}>
                        <Dropdown
                            text={this.state.searchMode}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={()=>{this.setState({searchMode:"문서제목"})}}>
                                문서제목
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={()=>{this.setState({searchMode:"작성자"})}}>
                                작성자
                            </Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Column>
                    <Grid.Column style={{paddingLeft:"0px"}}>
                    <Input
                        fluid
                        name="searchKeyword" 
                        onChange={this.handleInputChange}
                        placeholder={this.state.searchMode + "(으)로 검색"}/>
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
                            tag => {
                                if (this.state.tagDeleteMode){
                                    const isTagUsed = this.props.documents.some((doc) => (
                                        doc.tags.includes(tag.id) ? true : false
                                    ));
                                    return(
                                    <Popup
                                        key={"Tag"+tag.id}
                                        name={tag.id}
                                        on='click'
                                        open={this.state.tagDeletePopup === tag.id}
                                        onOpen={()=>{this.setState({tagDeletePopup:tag.id})}}
                                        pinned
                                        position="bottom center"
                                        textAlign='center'
                                        trigger={
                                            <Button
                                            as={Label}
                                            key={"Tag"+tag.id}
                                            style={{
                                                opacity:this.state.tagFilter.find(l=>l.id===tag.id).filter?1:0.2,
                                                margin:"0px 0.285714em 5px 0px",
                                                backgroundColor:tag.color,
                                                color:"white",}}>
                                            <Icon name='close'/>{tag.name}
                                            </Button>}
                                    >
                                        <div style={{textAlign:'center'}}>
                                            {isTagUsed ?
                                             <p><b> 이 태그는 아직 사용하는 문서가 있어 삭제할 수 없습니다! </b></p>:
                                             <p><b> 태그를 삭제합니까? </b></p>
                                            }
                                            {!isTagUsed &&
                                                <Button
                                                    color='red'
                                                    name={tag.id}
                                                    onClick={(_,data)=>{
                                                        this.deleteTag(data.name)
                                                        this.setState({tagDeletePopup:-1})
                                                        }
                                                    }
                                                >확인</Button>
                                            }
                                            <Button
                                                color='grey'
                                                name={tag.id}
                                                onClick={()=>{
                                                    this.setState({tagDeletePopup:-1})}}
                                            >취소</Button>
                                        </div>
                                    </Popup>)}
                                else return(<Button
                                    as={Label}
                                    key={"Tag"+tag.id}
                                    name={tag.id}
                                    onClick={(_,data)=>{this.handleTagFilterChange(data.name)}}
                                    style={{
                                        opacity:this.state.tagFilter.find(l=>l.id===tag.id).filter?1:0.2,
                                        margin:"0px 0.285714em 5px 0px",
                                        backgroundColor:tag.color,
                                        color:"white",}}>
                                    {this.state.tagDeleteMode&&<Icon name='close'/>}{tag.name}
                                </Button>);
                            }
                        )}
                        <div>
                            <Popup
                                key={"AddTag"}
                                on='click'
                                pinned
                                position="bottom center"
                                trigger={
                                    <Button
                                        as={Label}
                                        key={"AddNewTag"}
                                        color="grey"
                                        onClick={()=>{
                                            this.setState({
                                                tagDeletePopup:-1,
                                            })}}
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
                                        value={this.state.newTagName}
                                        onChange={this.handleInputChange}
                                        autoComplete='off'
                                        error={!/^[\S\s]+$/.test(this.state.newTagName)}/>
                                    <Form.Input 
                                        name='newTagColor'
                                        label='색상'
                                        placeholder='#FFFFFF'
                                        autoComplete='off'
                                        value={this.state.newTagColor}
                                        onChange={this.handleInputChange}
                                        error={!/^#[0-9A-F]{6}$/.test(this.state.newTagColor)}/>
                                    <Button
                                        size='small'
                                        type='submit'
                                        content="태그추가"
                                        disabled={!(/^[\S\s]+$/.test(this.state.newTagName) && /^#[0-9A-F]{6}$/.test(this.state.newTagColor))}
                                        onClick={this.addNewTag}/>
                                    </Form>
                            </Popup>
                            <Button
                                as={Label}
                                key={"AddNewTag"}
                                color="grey"
                                onClick={this.toggleTagDeleteMode}
                                style={{
                                    textAlign:"center",
                                    margin:"0px 0.285714em 5px 0px",}}>
                                <Icon name='minus'/>태그삭제
                            </Button>
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
                </>) :
                (<></>);

        return(
            <>
            <div style={{padding:'10px 0px 0px 20px',
                                width:"90%",
                                minWidth:"500px",
                                maxWidth:"1000px"}}>
            <Grid>
                <Grid.Row
                    columns='equal'
                    style={{paddingBottom:"5px"}}>
                    <Container
                        as={Grid.Column}
                        verticalAlign='middle'
                        textAlign='left'>
                        <div style={{fontSize:"25px"}}>ROKTION</div>
                        <div style={{fontSize:"15px"}}>국군정보공유체계</div>
                    </Container>
                    <Container
                        as={Grid.Column}
                        textAlign='right'
                        style={{paddingRight:"5px"}}>
                        <div>
                            {this.props.userInfo.regiment}
                        </div>
                        <div>
                            {this.props.userInfo.rank}
                            {this.props.userInfo.name}
                        </div>
                        <div style={{paddingTop:"5px"}}>
                            <Icon
                                name='search'
                                size='large'
                                onClick={this.toggleShowSearchTab}
                                style={{
                                    opacity:.8,
                                    cursor:"pointer"}}/>
                            <Icon
                                name='ellipsis horizontal'
                                size='large'
                                onClick={()=>{console.log("Ellipsis horizontal")}}
                                style={{
                                    opacity:.5,
                                    cursor:"pointer"}}/>
                        </div>
                    </Container>
                    <Grid.Column
                        style={{
                            paddingLeft:"0px",
                            marginRight:"30px",
                            minWidth:"45px",
                            maxWidth:"45px"}}>
                        <UserIcon handleLogout={this.props.handleLogout}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:"0px", paddingBottom:"0px"}}>
                    <Divider as={Grid.Column} style={{marginLeft:"20px", marginRight:"20px"}}/>
                </Grid.Row>
                {searchTab}
                <Container
                    as={Grid.Row}
                    style={{overflow:'auto', maxHeight:"550px", paddingTop:"0px"}}>
                    <List>{documentList}</List>
                </Container>
            </Grid>
            </div>
            </>
        );
    }
}

export default MainMenuLayout;