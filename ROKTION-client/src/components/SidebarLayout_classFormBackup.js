import React, {Component} from 'react'
import {
  Grid,
  Icon,
  Menu,
  Segment,
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

class SidebarLayout extends Component{
  constructor(props){
    super(props);
    this.state={
      visible: false,
    };

  }

  setVisible(x){
    console.log(x)
    this.setState({
      visible: x
    });
  }
  
  render(){
    let information = this.props.information;
    let list = information.map(
      data => (
        <Menu.Item key={data.id}>
          {data.menuTitle}
          {data.alert !== 0 && <Label color='red'> {data.alert} </Label>}   
        </Menu.Item>
      )
    );
  
    let totalAlerts = 0;
    information.forEach(data => (totalAlerts += data.alert));

    return (
      <>
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          vertical
          visible={!(this.state.visible)}
          width='very thin'
        >
          <Container style={{paddingTop:"9px"}}> {/*Button size 60x42 so (60-42)/2 */}
            <Button
              onClick = {() => {this.setVisible(true)}}
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
                                    circular
                                    size='tiny'
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
          visible={this.state.visible}
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
                  onClick = {() => {this.setVisible(false)}}
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
                {list}
              </Menu>
            </Grid.Row>
          </Grid>
        </Sidebar>
      </>
    );
  }
}

export default SidebarLayout