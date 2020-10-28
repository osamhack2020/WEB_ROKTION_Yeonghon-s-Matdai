import React, { Component } from 'react';
import {
    Popup,
    Icon,
    Menu,
} from 'semantic-ui-react';
import userContext from './UserContext';

class UserIcon extends Component {
    render() {
        return (
            <Popup
                key={"userPopup"}
                on='click'
                pinned
                position="bottom center"
                trigger={<Icon size={this.props.size} name='user circle'/>}
                style={{padding:"0px 5px 0px 5px",}}>
                    <Menu vertical secondary style={{width:"115px", textAlign:"center"}}>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='사용자정보 변경'
                            onClick={()=>{console.log("사용자정보 변경");}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='비밀번호 변경'
                            onClick={()=>{console.log("비밀번호 변경");}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='사용자 검색'
                            onClick={()=>{console.log("사용자 검색");}}/>
                        <userContext.Consumer>
                        {context => (
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='로그아웃'
                            onClick={context.handleLogout}/>
                        )}
                        </userContext.Consumer>
                    </Menu>
            </Popup>
        );
    }
}

export default UserIcon;