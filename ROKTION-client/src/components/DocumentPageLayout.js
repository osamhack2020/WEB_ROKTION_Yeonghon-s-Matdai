import React, {Component} from 'react';
import './Layout.css';
import Clock from './Clock';
import UserIcon from './UserIcon';
import DocumentSettingIcon from './DocumentSettingIcon';
import DocumentPageContent from './DocumentPageContent';
import MentionUserPopup from './MentionUserPopup';
import TodoPane from './TodoPane';
import MentionPane from './MentionPane';
import userContext from './UserContext';
import {
    Sidebar,
    Grid,
    Container,
    Progress,
    Divider,
    Icon,
    Pagination,
    Button,
    Popup,
    Loader,
    Tab,
  } from 'semantic-ui-react';

class DocumentPageLayout extends Component{
    constructor(props){
        super(props)
        this.state = {
            savedStatusText: '?' 
        };
    }

    /**
     * 0: 저장완료, 1: 작성중, 2: 저장중, 3: 저장오류, 4: 가져오는중, 5: 열람중(다 가져옴)
     */
    setSavedStatus = (status) => {
        let outStatus = '가져오는중';
        switch(status) {
            case 0:
                outStatus = <Icon name='check' size='small' color='green'/>;
                break;
            case 1:
                outStatus = <Loader size='tiny' indeterminate active inline/>;
                break;
            case 2:
                outStatus = <Loader size='tiny' active inline/>;
                break;
            case 3:
                outStatus = <Icon name='exclamation triangle' size='small' color='red'/>;
                break;
            case 4: 
                outStatus = <Loader size='tiny' indeterminate active inline/>;
                break;
            case 5: 
                outStatus = <Icon name='eye' size='small'/>;
                break;
            default:
                outStatus = '?';
        }
        this.setState({
            savedStatusText: outStatus
        })
    }

    render(){
        const selectedDocumentId = this.context.selectedDocumentId;
        const selectedPage = this.context.selectedPage;
        const document = this.context.documents.find(doc=>doc.id===selectedDocumentId)

        return(
            <Sidebar.Pusher className="pushableMainScreen" style={{overflow:'visible'}}>
                <Grid stackable={false} stretched>
                <Grid.Row>
                <Grid.Column
                    style={{
                        paddingRight:"0px",
                        width:"95vw",
                        minWidth:"700px",
                        maxWidth:"1000px",
                    }}>
                <div style={{padding:'10px 30px 10px 20px',
                             }}>
                    <Grid className="mainScreenGrid">
                        <Grid.Row
                            columns='equal' 
                            style={{paddingTop: '1rem', paddingBottom: '0rem'}}>
                            <Container
                                as={Grid.Column}
                                textAlign='left'>
                                <Clock/>
                            </Container>
                            <Container
                                as={Grid.Column}
                                textAlign='right'
                                style={{paddingRight:'8px'}}>
                                <Icon.Group size='big' style={{marginRight:'10px'}}>
                                    <Icon name='file outline'/>
                                    <Icon corner name='search'/> 
                                </Icon.Group>
                                <DocumentSettingIcon/>
                                {false && <Icon size='large' name='ellipsis horizontal' style={{marginRight:'10px'}}/>}
                                <UserIcon size='big'/>
                            </Container>
                        </Grid.Row>
                        <Grid.Row
                            columns='equal'
                            verticalAlign='bottom'
                            style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
                            <Container
                                as={Grid.Column}
                                className="title noLeftMargin"
                                textAlign='left'>
                                <b style={{fontSize:40, lineHeight:'40px'}}>
                                {document.title}</b>
                                {this.state.savedStatusText}
                            </Container>
                            <Container
                                as={Grid.Column}
                                textAlign='right'
                                width={4}
                                style={{top:'.4rem', fontSize:15}}>
                                <b>지시 및 책임자: {document.admin}</b>
                            </Container>
                        </Grid.Row>
                            <Grid.Row style={{paddingTop: '.5rem', paddingBottom: '0rem'}}>
                            <Container as={Grid.Column}
                                        className="progressBar noLeftMargin">
                                <Progress percent={100}
                                            color='grey'
                                            size='small'/>
                            </Container>
                            </Grid.Row>
                        <Grid.Row style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
                            <Divider as={Grid.Column}/>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: '1.5rem', paddingBottom: '0rem'}}>
                            <Container 
                                as={Grid.Column}
                                style={{height:'calc(100vh - 209.5px - 10.5px)'}}
                                className="contentContainer noLeftMargin"
                                textAlign='left'>
                                <DocumentPageContent 
                                    pageData={document.documentContent[selectedPage]} 
                                    sharedPermission={document.permission}
                                    setSavedStatus={this.setSavedStatus}/>
                            </Container>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}></Grid.Column>
                            <Container as={Grid.Column} width={10} textAlign='center'>
                                <Pagination
                                    onPageChange = {
                                        (_,data) => {
                                            this.context.jumpTo(selectedDocumentId, data.activePage-1)
                                        }
                                    }
                                    boundaryRange={0}
                                    activePage={selectedPage+1}
                                    ellipsisItem={null}
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    siblingRange={3}
                                    pointing
                                    secondary
                                    totalPages={document.documentContent.length}/>
                            </Container>
                            <Grid.Column width={3} textAlign='right'>
                                <userContext.Consumer> 
                                { context => (
                                <>
                                <MentionUserPopup
                                    docid={selectedDocumentId}
                                    page={selectedPage}/>
                                <Popup
                                    trigger={
                                        <Button 
                                        color='grey' 
                                        icon='file'/>
                                    }
                                    content={
                                        <Grid style={{width:'150px'}} textAlign='center'>
                                            <Grid.Row style={{paddingBottom:'5px'}}><Button 
                                            color='green'
                                            content='페이지 추가'
                                            icon='plus'
                                            onClick={() => {
                                                context.addPageAfter(selectedPage)
                                                .then(() => {
                                                    this.context.jumpTo(selectedDocumentId, selectedPage+1)
                                                });
                                            }}/></Grid.Row>
                                            <Grid.Row style={{paddingTop:"0px"}}><Button 
                                            color='red'
                                            content='페이지 삭제'
                                            icon='minus'
                                            onClick={() => {
                                                this.context.jumpTo(selectedDocumentId, selectedPage-1)
                                                this.context.removePage(selectedPage)
                                            }}/></Grid.Row>
                                        </Grid>
                                    }
                                    on='click'
                                    position='top right'
                                />
                                </>
                                )}
                                </userContext.Consumer>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                </Grid.Column>
                <Grid.Column style={{paddingLeft:"0px"}}>
                <Tab
                    menu={{secondary:true, pointing:true}}
                    style={{
                        width:"600px", //이거 화면 모양 달라지면 무조건 문제될텐데 다른 방법이 없다 신밧드
                        paddingTop:"10px",
                    }}
                    panes={[
                    { menuItem: '메모장', render: () => <Tab.Pane><TodoPane/></Tab.Pane> },
                    { menuItem: '언급', render: () => <Tab.Pane><MentionPane/></Tab.Pane> },
                ]}/>
                </Grid.Column>
                </Grid.Row>
                </Grid>
            </Sidebar.Pusher>
        );
    }
}

DocumentPageLayout.contextType = userContext;
export default DocumentPageLayout;