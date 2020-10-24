import React, { Component } from 'react';
import UserIcon from './UserIcon';
import {SketchPicker} from 'react-color';
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
    Menu,
} from 'semantic-ui-react';

class MainMenuLayout extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchMode: "문서제목",
            searchKeyword: "",
            newTagName: "",
            newTagColor: "",
            newDocTitle: "",
            newDocColor: "",
            filterAllTags:false,
            showAllTags:false,
            showSearchTab:false,
            tagDeleteMode:false,
            tagDeletePopup:-1,
            tagSettingDocId:-1,
            titleSettingDocId:-1,
            docIdOnSettingMode:-1,
            tagFilter:props.tags.map(
                tag=>(
                    {id:tag.id, filter:true}
                    )
                ),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        // 매번 tag list 바뀌었는지 체크하지 않고 매번 tagFilter 재생산
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
        this.setState({
            tagDeleteMode:!val,
        });
    }

    setDocIdOnSettingMode = (id) => {
        const val = this.state.docIdOnSettingMode
        console.log(val, id)
        if(val === id || id === -1){
            //변경 정보 app.js에서 저장
            this.props.changeDocumentSettings(id, this.state.newDocColor, this.state.newDocTitle)
            //설정 종료
            this.setState({
                newDocTitle: "",
                newDocColor: "",
                docIdOnSettingMode: -1,
            })
        }
        else{
            //기본 설정 넣어주기
            const doc = this.props.documents.find(doc=>doc.id===id)
            this.setState({
                newDocTitle: doc.title,
                newDocColor: doc.color,
                docIdOnSettingMode: id,
            });
        }
    }

    addNewTag = () => {
        const name = this.state.newTagName;
        const color = this.state.newTagColor;
        if (/^[\S\s]+$/.test(name)){
            this.props.addNewTag(name, color, true);
            this.setState({
                newTagName:"",
                newTagColor:"",
            })
        }
    }

    deleteTag = (id) => {
        if(this.props.documents.every((doc) => (
            doc.tags.has(id) ? false : true   
        ))){
            this.props.deleteTag(id);
        }
    }

    // <Label key={"Tag"+tag.id} color={tag.color}>{tag.name}</Label>
    render() {
        const tagFilteredList = this.props.documents.filter(
            document => (
                [...document.tags].some(
                    tag=>{
                        const t = this.state.tagFilter.find(l=>l.id===tag)
                        return t !== undefined ? t.filter : false}) && document
            )
        );
        
        const keywordFilteredList = tagFilteredList.filter(
            document => document.title.indexOf(this.state.searchKeyword) > -1
        );
        
        const documentList = keywordFilteredList.length === 0 ?
            <h1
                style={{
                    width:'inherit',
                    textAlign:'center',
                    paddingTop:'100px',
                    opacity:.5,
                    }}>
                    Nobody here but us chickens!
            </h1>:
            keywordFilteredList.map(
                document => (
                    <List.Item key={"Doc"+document.id}>
                    <Grid columns={3}>
                        <Grid.Row columns='equal'>
                            <Grid.Column
                                verticalAlign='middle'
                                style={{
                                    minWidth:"140px",
                                    maxWidth:"140px",
                                    paddingLeft:"0px",
                                    paddingRight:"0px",}}>
                                <Container textAlign='center'>
                                    {this.state.docIdOnSettingMode === document.id ?
                                        <Popup
                                            key={"AddTag"}
                                            on='click'
                                            pinned
                                            position="bottom left"
                                            trigger={
                                                <Icon.Group
                                                    style={{
                                                        cursor:"pointer"}}>
                                                    <Icon
                                                        name='square'
                                                        size='massive'
                                                        style={{
                                                            color: document.color,
                                                        }}
                                                    />
                                                    <Icon
                                                        inverted
                                                        size='huge'
                                                        name='pencil square'
                                                        style={{opacity:.8,}}/> 
                                                </Icon.Group>
                                            }
                                        >
                                            <Form>
                                            <Form.Field>
                                                <label>색상</label>
                                                <SketchPicker
                                                    disableAlpha
                                                    color={ this.state.newDocColor }
                                                    onChange={(color)=>{this.setState({newDocColor:color.hex})}}
                                                    presetColors={[]}
                                                    style={{boxShadow:'none'}}
                                                />
                                            </Form.Field>
                                            <Button
                                                size='small'
                                                type='submit'
                                                content="색상변경"
                                                onClick={()=>{
                                                    this.props.changeDocumentSettings(document.id, this.state.newDocColor, this.state.newDocTitle);
                                                }}/>
                                            </Form>
                                        </Popup>
                                        :
                                        <Icon
                                            onClick={document.onClick}
                                            name='square'
                                            size='massive'
                                            style={{
                                                cursor:"pointer",
                                                color: document.color,
                                            }}
                                        />
                                    }
                                </Container>
                            </Grid.Column>
                            <Grid.Column style={{paddingLeft:"0px"}}>
                                {this.state.docIdOnSettingMode === document.id ?
                                    <Input
                                        fluid
                                        defaultValue={document.title}
                                        size='big'
                                        name='newDocTitle'
                                        action={{
                                            content:'변경완료',
                                            onClick:()=>{ this.setDocIdOnSettingMode(document.id);},
                                        }}
                                        onChange={this.handleInputChange}
                                        style={{
                                            paddingTop:"15px",}}
                                    />
                                    :
                                    <div
                                        onClick={document.onClick}
                                        style={{
                                            paddingTop:"15px",
                                            fontSize:"30px",
                                            lineHeight:"30px",
                                            cursor:"pointer",}}>
                                        {document.title}
                                    </div>
                                }
                                <div style={{paddingTop:"10px", paddingBottom:"15px"}}>
                                {
                                    this.state.docIdOnSettingMode === document.id ?
                                    this.props.tags.map(
                                        tag => (
                                            <Button
                                                as={Label}
                                                key={"Tag"+tag.id}
                                                onClick={()=>{
                                                    this.props.toggleTagInDocument(document.id, tag.id);
                                                }}
                                                style={{
                                                    opacity:document.tags.has(tag.id)?1:0.2,
                                                    backgroundColor:tag.color,
                                                    margin:"0px 0.285714em 3px 0px",
                                                    color:"white"}}>
                                                {tag.name}
                                            </Button>
                                        )
                                    ) :
                                    this.props.tags.map(
                                        tag => (
                                            (document.tags.has(tag.id)) &&
                                            <Label
                                                key={"Tag"+tag.id}
                                                style={{
                                                    opacity:this.state.tagFilter.find(l=>l.id===tag.id).filter?1:0.2,
                                                    backgroundColor:tag.color,
                                                    margin:"0px 0.285714em 3px 0px",
                                                    color:"white"}}>
                                                {tag.name}
                                            </Label>
                                        )
                                    )
                                }
                                </div>
                            </Grid.Column>
                            <Grid.Column width={1}>
                            <Popup
                                key={"documentSetting" + document.id}
                                on='click'
                                pinned
                                position="bottom center"
                                trigger={<Icon
                                            floated='right'
                                            name='genderless'
                                            size='large'
                                            style={{
                                                marginTop:'10px',
                                                opacity:.5,
                                                cursor:"pointer",
                                            }}
                                        />}
                                style={{padding:"0px 5px 0px 5px",}}>
                                    <Menu vertical secondary style={{width:"90px", textAlign:"center"}}>
                                        <Menu.Item
                                            style={{padding:"8px 0px 8px 0px", margin:"0px"}}
                                            fitted='horizontally'
                                            name='정보변경'
                                            docid={document.id}
                                            onClick={(_,data)=>{this.setDocIdOnSettingMode(data.docid)}}/>
                                        <Menu.Item
                                            style={{padding:"8px 0px 8px 0px", color:"red", margin:"0px"}}
                                            fitted='horizontally'
                                            name='문서삭제'
                                            docid={document.id}
                                            onClick={(_,data)=>{this.props.deleteDocument(data.docid)}}
                                        />
                                    </Menu>
                            </Popup>
                                
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    </List.Item>
                )
            )

        // showSearchTab이 true일때만 렌더
        const searchTab = this.state.showSearchTab ?
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
                            maxHeight:this.state.showAllTags?null:"28px",
                            overflow:this.state.showAllTags?null:"hidden"}}>
                               
                        {this.props.tags.map(
                            tag => {
                                if (this.state.tagDeleteMode){
                                    const isTagUsed = this.props.documents.some((doc) => (
                                        doc.tags.has(tag.id) ? true : false
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
                                        trigger={
                                            <Button
                                            as={Label}
                                            key={"Tag"+tag.id}
                                            style={{
                                                opacity:this.state.tagFilter.find(l=>l.id===tag.id).filter?1:0.2,
                                                margin:"0px 0.285714em 3px 0px",
                                                backgroundColor:tag.color,
                                                color:"white",}}>
                                            <Icon name='close'/>{tag.name}
                                            </Button>}
                                    >
                                        <div style={{textAlign:'center'}}>
                                            {(tag.id <= 4) ?
                                                <p><b> 주요 태그는 삭제할 수 없습니다! </b></p>:
                                                isTagUsed ?
                                                <p><b> 이 태그는 아직 사용하는 문서가 있어 삭제할 수 없습니다! </b></p>:
                                                <p><b> 태그를 삭제합니까? </b></p>
                                            }
                                            {(!isTagUsed && tag.id>4) &&
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
                                        margin:"0px 0.285714em 3px 0px",
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
                                            margin:"0px 0.285714em 3px 0px",}}>
                                        <Icon name='plus'/>태그추가
                                    </Button>}>
                                    <Form>
                                    <Form.Input 
                                        name='newTagName'
                                        label='이름'
                                        placeholder='태그 이름'
                                        value={this.state.newTagName}
                                        onChange={this.handleInputChange}
                                        autoComplete='off'/>
                                    <Form.Field>
                                        <label>색상</label>
                                        <SketchPicker
                                            disableAlpha
                                            color={ this.state.newTagColor }
                                            onChange={(color)=>{this.setState({newTagColor:color.hex})}}
                                            presetColors={[]}
                                            style={{boxShadow:'none'}}
                                        />
                                    </Form.Field>
                                    
                                    <Button
                                        size='small'
                                        type='submit'
                                        content="태그추가"
                                        disabled={!/^[\S\s]+$/.test(this.state.newTagName)}
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
                                    margin:"0px 0.285714em 3px 0px",}}>
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
                </> :
                <></>;

        return(
            <>
            <div style={{
                paddingTop:"10px",
                position: 'absolute',
                left:"50%",
                transform: "translate(-50%,0%)",
                width:"90%",
                minWidth:"500px",
                maxWidth:"1000px"
                }}>
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
                                    marginRight:'8px',
                                    opacity:.8,
                                    cursor:"pointer"}}/>
                            <Icon.Group
                                size='big'
                                onClick={this.props.createNewDocument}
                                style={{
                                    opacity:.8,
                                    cursor:"pointer"}}>
                                <Icon name='file outline'/>
                                <Icon corner name='plus'/> 
                            </Icon.Group>
                        </div>
                    </Container>
                    <Grid.Column
                        verticalAlign='middle'
                        style={{
                            paddingLeft:"0px",
                            marginRight:"30px",
                            minWidth:"45px",
                            maxWidth:"45px"}}>
                        <UserIcon size='huge' handleLogout={this.props.handleLogout}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:"0px", paddingBottom:"0px"}}>
                    <Divider as={Grid.Column} style={{marginLeft:"20px", marginRight:"20px"}}/>
                </Grid.Row>
                {searchTab}
                <Container
                    as={Grid.Row}
                    style={{
                        overflow:'auto',
                        minHeight:"100px",
                        maxHeight:"550px",
                        paddingTop:"0px",
                        paddingLeft:"15px",}}>
                    <List
                        divided
                        style={{
                            width:'calc(100% - 15px)',
                        }}>
                            {documentList}
                    </List>
                </Container>
            </Grid>
            </div>
            </>
        );
    }
}

export default MainMenuLayout;