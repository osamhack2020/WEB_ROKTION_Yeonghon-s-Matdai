import React, {Component} from 'react';
import './Layout.css';
import Clock from './Clock';
import UserIcon from './UserIcon';
import DocumentSettingIcon from './DocumentSettingIcon';
import {
    Sidebar,
    Grid,
    Container,
    Progress,
    Divider,
    Icon,
    Pagination,
  } from 'semantic-ui-react';
import DocumentPageContent from './DocumentPageContent';

class DocumentPageLayout extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedPage: 0,
            documentId: -1,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.document.id !== prevState.documentId) {
            return {
                selectedPage: 0,
                documentId: nextProps.document.id,
            };
        } else {
            return {};
        }
    }

    render(){
        return(
            <Sidebar.Pusher className="pushableMainScreen" style={{overflow:'visible'}}>
                <div style={{padding:'10px 0px 0px 20px',
                             width:"90%",
                             minWidth:"500px",
                             maxWidth:"1000px",
                             overflow:"visible",}}>
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
                                <UserIcon size='big' handleLogout={this.props.handleLogout}/>
                            </Container>
                        </Grid.Row>
                        <Grid.Row
                            columns='equal'
                            verticalAlign='bottom'
                            style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
                            <Container
                                as={Grid.Column}
                                className="title noLeftMargin"
                                textAlign='left'
                                style={{fontSize:40, lineHeight:'40px'}}>
                                <b>{this.props.document.title}</b>
                            </Container>
                            <Container
                                as={Grid.Column}
                                textAlign='right'
                                width={4}
                                style={{top:'.4rem', fontSize:15}}>
                                <b>지시 및 책임자: {this.props.document.admin}</b>
                            </Container>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: '.5rem', paddingBottom: '0rem'}}>
                            <Container as={Grid.Column}
                                        className="progressBar noLeftMargin">
                                <Progress percent={80}
                                            color='green'
                                            size='small'/>
                            </Container>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
                            <Divider as={Grid.Column}/>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop: '1.5rem', paddingBottom: '0rem'}}>
                            <Container as={Grid.Column}
                                        className="contentContainer noLeftMargin"
                                        textAlign='left'>
                                <DocumentPageContent myOpt={this.props.document.documentContent[this.state.selectedPage]}></DocumentPageContent>
                            </Container>
                        </Grid.Row>
                        <Grid.Row>
                            <Container as={Grid.Column} textAlign='center'>
                                <Pagination
                                    onPageChange = {
                                        (_,data) => {
                                            this.setState({
                                                selectedPage:data.activePage-1,
                                            });
                                        }
                                    }
                                    boundaryRange={0}
                                    activePage={this.state.selectedPage+1}
                                    ellipsisItem={null}
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    siblingRange={3}
                                    pointing
                                    secondary
                                    totalPages={this.props.document.documentContent.length}/>
                            </Container>
                        </Grid.Row>
                    </Grid>
                </div>
            </Sidebar.Pusher>
        );
    }
}

export default DocumentPageLayout;