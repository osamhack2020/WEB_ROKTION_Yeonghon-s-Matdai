import React from 'react'
import userContext from './UserContext'
import logo from '../img/invertedFittedLogo.png';
import {
  Grid,
  Icon,
  Menu,
  Sidebar,
  Divider,
  Button,
  Container,
  Label,
  Accordion,
  Image,
} from 'semantic-ui-react'


/*
TODO: 최적화?
TODO: 메인화면 내용구성 Props로 가져올 수 있게 하기
TODO: 메뉴 바 Label 위치조정
*/ 

// Accordion Title 부분 스타일 맞추기

const DocumentPageSidebar = () => {
  const [visible, setVisible] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const mainTagList = ['진행','예정','완료','문서','중요'].map(
    (tag, idx) => {
      return(
        <Container key={idx}>
          <Accordion.Title
            key={tag+'title'}
            active={activeIndex === idx}
            index = {idx}
            style={{color:'white', fontSize:'18px'}}
            onClick = {()=>{setActiveIndex(activeIndex === idx ? -1 : idx);}}>
            <Icon name='dropdown'/>
            {tag}
          </Accordion.Title>
          <Accordion.Content
            key={tag+'content'}
            active={activeIndex===idx}
            style={{paddingTop:'0px', paddingBottom:'0px'}}>
          <Menu size='massive' fluid vertical secondary>
            <userContext.Consumer>
              { context => (
                context.documents.map(
                  data => (
                    data.tags.has(idx) &&
                    <Menu.Item
                      key={data.id}
                      style={{paddingTop:"0px", paddingBottom:"0px", marginTop:"15px"}}
                      onClick={()=>{context.jumpTo(data.id, 0); setVisible(false);}}>
                      <Grid>
                        <Grid.Row
                          columns='equal'
                          verticalAlign='middle'
                          style={{paddingTop:'5px', paddingBottom:"5px", minHeight:"32px"}}>
                          <Grid.Column
                            textAlign='left'
                            style={{lineHeight:'17px', paddingRight:'9px'}}>
                              {data.title}
                          </Grid.Column>
                          <Grid.Column
                            width={1}
                            textAlign='center'
                            style={{padding:'0px 49px 0px 0px'}}>
                            {data.alert !== 0 && <Label size='mini' color='red'> {data.alert} </Label>}   
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Menu.Item>
                  )
                )
              )}
            </userContext.Consumer>
          </Menu>
          </Accordion.Content>
        </Container>
      )
    }
  )

  return (
    <>
      <Sidebar
        as={Menu}
        animation='push'
        inverted
        vertical
        visible={!visible}
        width='very thin'
      >
        <Container style={{paddingTop:"30px"}}> {/*Button size 60x42 so (60-42)/2 */}
          <Button
            onClick = {() => {setVisible(true)}}
            style={{marginRight:"0rem", paddingBottom:"3px"}} 
            basic color='black'
            circular
            icon>
            <Icon inverted size='big' name='angle double right'/>
          </Button>
        </Container>
        <Container
          style={{display:"block", textAlign:"center"}}>
          <userContext.Consumer>
            { context => {
              let totalAlerts = 0;
              context.documents.forEach(data => (totalAlerts += data.alert));
              
              if (totalAlerts !== 0)
                return(<Label size='mini' color='red'> {totalAlerts} </Label>)
              else
                return(<></>)
            }}
          </userContext.Consumer>
        </Container>                 
      </Sidebar>

      <Sidebar
        as={Menu}
        animation='overlay'
        inverted
        vertical
        visible={visible}
        width='wide'
      >
        <Grid relaxed padded columns='equal' textAlign='center' style={{paddingTop:"15px"}}>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={11} verticalAlign='middle' style={{paddingRight:"0px"}}>                   
              <Image
                src={logo}
                alt="Logo"
                style={{
                  width:"200px",
                  marginLeft:"14px",
                  marginTop:"3px"
                }}/>
            </Grid.Column>
            <Grid.Column style={{paddingLeft:"0px"}}>
              <Button
                onClick = {() => {setVisible(false)}}
                basic
                circular
                icon
                color='black'
                >
                <Icon inverted size='big' name='angle double left'/>
              </Button>
            </Grid.Column>
          </Grid.Row> 
          <Grid.Row style={{paddingTop:"0px", paddingBottom:"0px"}}>
           <Divider as={Grid.Column} style={{marginLeft:"20px", marginRight:"20px"}}/>
          </Grid.Row>
          <Grid.Row>
            <Menu size='massive' fluid vertical secondary>
              <userContext.Consumer>
                {context => (
                <Menu.Item
                  style={{textAlign:"center", fontSize:"20px", color:"white"}}
                  key={"ToMainMenu"}
                  onClick={context.toMainMenu}>
                  문서 목록
                </Menu.Item>
                )}
              </userContext.Consumer>
            </Menu>
            <Accordion
              inverted
              fluid
              style={{paddingLeft:'15px'}}>
                {mainTagList}
            </Accordion>
          </Grid.Row>
        </Grid>
      </Sidebar>
    </>
  )
}

export default DocumentPageSidebar;