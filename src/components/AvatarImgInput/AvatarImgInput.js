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
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  _handleOnChangeImage (e) {
    const { onChangeImage } = this.props
    if (onChangeImage) onChangeImage()
    const image = e.target.files[0]
    this.setState({ image })
  }
  _handleOnRemoveImage () {
    const { onChangeImage } = this.props
    if (onChangeImage) onChangeImage()
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
          (this.state.image || this.props.image) &&
          <AvatarEditor
            ref={this._setEditorRef}
            image={image || this.props.image}
            scale={scale}
            width={250}
            height={250}
            border={25}
          />
        }
        <div className='row'>
          <div className='col-xs-12'>
            <Button text={image || this.props.image ? '이미지변경' : '이미지선택'} color='orange' onClick={() => $('#avatarInput').click()} />
            {(image || this.props.image) && <Button className='m-l-5' link text='이미지삭제' onClick={this._handleOnRemoveImage} />}
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
  onChangeImage: PropTypes.func,
  image: PropTypes.string
}

export default AvatarImgInput
