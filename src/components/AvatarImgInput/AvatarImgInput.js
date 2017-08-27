import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'
import AvatarEditor from 'react-avatar-editor'
import $ from 'jquery'

import Button from 'components/Button'

class AvatarImgInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null
    }
    this._handleOnChangeImage = this._handleOnChangeImage.bind(this)
    this._handleOnRemoveImage = this._handleOnRemoveImage.bind(this)
    this._setEditorRef = this._setEditorRef.bind(this)
  }
  shouldUpdateComponent (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  _handleOnChangeImage (e) {
    const image = e.target.files[0]
    this.setState({ image })
  }
  _handleOnRemoveImage () {
    this.setState({ image: null })
    document.getElementById('avatarInput').files = null
  }
  _setEditorRef (editor) {
    window.editor = editor
  }
  render () {
    const { image, scale } = this.state
    return (
      <div>
        {
          this.state.image &&
          <AvatarEditor
            ref={this._setEditorRef}
            image={image}
            scale={scale}
            width={200}
            height={200}
            border={25}
          />
        }
        <div className='row'>
          <div className='col-xs-12'>
            <Button text={image ? '사진변경' : '사진선택'} color='orange' onClick={() => $('#avatarInput').click()} />
            {image && <Button link text='사진삭제' onClick={this._handleOnRemoveImage} />}
            <input style={{ display: 'none' }} accept='image/*' id='avatarInput' type='file' onChange={this._handleOnChangeImage} />
          </div>
        </div>
      </div>
    )
  }
}

AvatarImgInput.contextTypes = {
  router: PropTypes.object.isRequired
}

AvatarImgInput.propTypes = {
  onClickSave: PropTypes.object.isRequired
}

export default AvatarImgInput
