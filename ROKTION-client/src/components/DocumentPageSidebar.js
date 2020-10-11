import React from 'react'
import {
  Grid,
  Icon,
  Menu,
  Sidebar,
  Divider,
  Button,
  Container,
  Label
} from 'semantic-ui-react'

/*
TODO: 최적화?
TODO: 메인화면 내용구성 Props로 가져올 수 있게 하기
TODO: 메뉴 바 Label 위치조정
*/ 

const DocumentPageSidebar = (props) => {
  const [visible, setVisible] = React.useState(false)
  let documents = props.documents
  let list = documents.map(
    data => (
      <Menu.Item
        key={data.id}
        onClick={()=>{data.onClick(); setVisible(false);}}>
        {data.title}
        {data.alert !== 0 && <Label color='red'> {data.alert} </Label>}   
      </Menu.Item>
    )
  );

  let totalAlerts = 0;
  documents.forEach(data => (totalAlerts += data.alert));

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
        <Container style={{paddingTop:"9px"}}> {/*Button size 60x42 so (60-42)/2 */}
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
        {totalAlerts !== 0 && <Label
                                  size='mini'
                                  color='red'>
                                    {totalAlerts}
                                </Label>}
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
        <Grid relaxed padded columns='equal' textAlign='center'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={10}>
              <div style={{color:"white", fontSize:"25px"}}>ROKTION</div>
              <div style={{color:"white", fontSize:"15px"}}>국군정보공유체계</div>
            </Grid.Column>
            <Grid.Column>
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
              <Menu.Item
                style={{textAlign:"center", fontSize:"20px"}}
                key={-2}
                onClick={props.toMainMenu}>
                문서 목록
              </Menu.Item>
              {list}
            </Menu>
          </Grid.Row>
        </Grid>
      </Sidebar>
    </>
  )
}

export default DocumentPageSidebar;