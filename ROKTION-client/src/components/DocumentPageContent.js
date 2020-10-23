import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class DocumentPageContent extends Component {
    render() {
        return (
            <div
                className="editor"
                style={{minHeight:"500px", maxHeight:"500px"}}>
                <CKEditor
                    editor={ ClassicEditor }
                    // 기존 데이터 넣어주기
                    data={this.props.content}
                    onInit={ editor => {
                        //console.log( 'Editor is ready to use!', editor );
                    } }
                    // 얘에서 데이터 업데이트 함수 불러야할듯
                    onChange={ ( event, editor ) => {
                        //const data = editor.getData();
                        //console.log( { event, editor, data } );
                    } }

                    // 이 두개는 실시간 저장 켜고 끌 때 쓸 수 있겠다
                    onBlur={ ( event, editor ) => {
                        //console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        //console.log( 'Focus.', editor );
                    } }
                />
            </div>
        );
    }
}

export default DocumentPageContent;