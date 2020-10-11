import React, { Component } from 'react';
import {
    Popup,
    Icon,
    Menu,
    Divider,
} from 'semantic-ui-react';

class UserIcon extends Component {
    render() {
        return (
            <Popup
                key={"AAA"}
                on='click'
                pinned
                position="bottom center"
                trigger={<Icon size='big' name='user circle'/>}
                style={{padding:"0px 5px 0px 5px",}}>
                    <Menu fitted vertical secondary style={{width:"70px", textAlign:"center"}}>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='정보수정'
                            onClick={()=>{console.log("정보수정");}}/>
                        <Divider style={{margin:"0px"}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='로그아웃'
                            onClick={this.props.handleLogout}/>
                    </Menu>
            </Popup>
        );
    }
}

export default UserIcon;