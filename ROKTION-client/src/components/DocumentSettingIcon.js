import React, { Component } from 'react';
import {
    Popup,
    Icon,
    Menu,
} from 'semantic-ui-react';

class DocumentSettingIcon extends Component {
    render() {
        return (
            <Popup
                key={"documentPopup"}
                on='click'
                pinned
                position="bottom center"
                trigger={
                    <Icon.Group size='big' style={{marginRight:'8px'}}>
                        <Icon name='file outline'/>
                        <Icon corner name='cog'/> 
                    </Icon.Group>
                }
                style={{padding:"0px 5px 0px 5px",}}>
                    <Menu vertical secondary style={{width:"100px", textAlign:"center"}}>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='제목 변경'
                            onClick={()=>{alert('문서 목록에서 가능합니다.');}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='권한 설정'
                            onClick={()=>{alert('문서 목록에서 가능합니다.');}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px"}}
                            fitted='horizontally'
                            name='소유자 이전'
                            onClick={()=>{alert('미완성입니다.');}}/>
                        <Menu.Item
                            style={{padding:"10px 0px 10px 0px", margin:"0px", color:'red'}}
                            fitted='horizontally'
                            name='문서 삭제'
                            onClick={()=>{alert('문서 목록에서 가능합니다.');}}/>
                    </Menu>
            </Popup>
        );
    }
}

export default DocumentSettingIcon;