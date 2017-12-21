import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import keygen from 'keygenerator'
import clipboard from 'clipboard-js'

import ContentContainer from 'components/ContentContainer'
import TextArea from 'components/TextArea'
import AvatarImgInput from 'components/AvatarImgInput'
import WarningText from 'components/WarningText'
import Button from 'components/Button'
import { toast } from 'react-toastify'

import { getMsg, isIE, dataURItoBlob, getImageNameFromUrl } from 'utils/commonUtil'

import { DEFAULT_PROFILE_IMAGE_URL, PROFILE_IMAGE_ROOT } from 'constants/urls'

import { setUserPath } from 'services/UserService'
import { postImage, deleteImage } from 'services/ImageService'

class SettingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      introduce: props.user.introduce,
      profileImage: props.user.profileImage,
      isImageEdited: false,
      isTextEdited: false,
      isLoading: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickApply = this._handleOnClickApply.bind(this)
    this._handleOnClickSendPasswordResetEmail = this._handleOnClickSendPasswordResetEmail.bind(this)
    this._handleOnClickCodeCopy = this._handleOnClickCodeCopy.bind(this)
    this._handleOnChangeTutorial = this._handleOnChangeTutorial.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnChangeInput (e) {
    const { value, name } = e.target
    this.setState({ [name]: value, isTextEdited: true })
  }
  _handleOnClickApply () {
    this.setState({ isLoading: true })
    const { firebase, auth, user, messages, locale } = this.props
    const { introduce, isTextEdited, isImageEdited } = this.state
    const promArr = []
    let profileImageFile = null
    if (isTextEdited) promArr.push(setUserPath(firebase, auth.uid, 'introduce', introduce))
    if (isImageEdited) {
      if (user.profileImageKey) {
        promArr.push(deleteImage(firebase, `profileImages/${getImageNameFromUrl(user.profileImage)}`, `profileImages/${user.profileImageKey}`))
        promArr.push(deleteImage(firebase, `profileImages/thumb_${getImageNameFromUrl(user.profileImage)}`, `profileImages/${user.profileImageKey}`))
      }
      if (window.editor) {
        const dataURI = window.editor.getImageScaledToCanvas().toDataURL()
        if (dataURI) {
          const blob = dataURItoBlob(dataURI)
          profileImageFile = new File([blob], keygen._(), { type: blob.type })
        }
      } else {
        promArr.push(setUserPath(firebase, auth.uid, 'profileImage', DEFAULT_PROFILE_IMAGE_URL))
        promArr.push(setUserPath(firebase, auth.uid, 'profileImageKey', null))
      }
    }
    let profileImageUrl
    Promise.all(promArr)
    .then(() => {
      if (profileImageFile) return postImage(firebase, PROFILE_IMAGE_ROOT, [profileImageFile])
      return Promise.resolve()
    })
    .then(res => {
      if (profileImageFile) {
        const promArr = []
        profileImageUrl = res[0].File.downloadURL
        const profileImageKey = res[0].key
        promArr.push(setUserPath(firebase, auth.uid, 'profileImage', profileImageUrl))
        promArr.push(setUserPath(firebase, auth.uid, 'profileImageKey', profileImageKey))
        return Promise.all(promArr)
      }
      return Promise.resolve()
    })
    .then(() => {
      if (profileImageUrl) document.getElementById('sidebarProfileImage').src = profileImageUrl
      toast(getMsg(messages.setting.success, locale))
      this.setState({ isImageEdited: false, isTextEdited: false, isLoading: false })
      // window.swal(`${getMsg(messages.common.successShort, locale)}!`, getMsg(messages.common.success, locale), 'success')
    })
    .catch(msg => {
      this.setState({ isLoading: false })
      window.swal(`${getMsg(messages.common.oops, locale)}`, `${getMsg(messages.common.fail, locale)} - ${msg}`, 'error')
    })
  }
  _handleOnClickSendPasswordResetEmail () {
    const { auth, firebase, messages, locale } = this.props
    window.swal({ title: getMsg(messages.setting.sendComplete, locale), text: auth.email })
    this.context.router.push('/')
    firebase.resetPassword(auth.email)
  }
  _handleOnClickCodeCopy () {
    const { user, messages, locale } = this.props
    clipboard.copy(user.recommenderCode)
    toast(getMsg(messages.setting.copied, locale))
  }
  _handleOnChangeTutorial (e) {
    const { firebase, auth } = this.props
    const { checked } = e.target
    let status = checked ? '활성화 됐습니다.' : '비활성화 됐습니다.'
    setUserPath(firebase, auth.uid, 'isTutorialOn', checked)
    .then(() => setUserPath(firebase, auth.uid, 'tutorialStep', 1))
    .then(() => toast(`튜토리얼이 ${status}`))
  }
  render () {
    const { messages, locale, user } = this.props
    const { profileImage, introduce, isImageEdited, isTextEdited, isLoading } = this.state
    const renderBody = () => {
      return (
        <div className='row'>
          <p className='col-sm-offset-3 col-sm-6 f-700'>{getMsg(messages.signUp.profileImage, locale)}</p>
          <div className='col-sm-12 text-center'>
            {!isIE() && <AvatarImgInput image={profileImage} onChangeImage={() => this.setState({ profileImage: null, isImageEdited: true })} />}
            {isIE() && <WarningText text={getMsg(messages.common.noIE, locale)} />}
          </div>
          <p className='col-sm-offset-3 col-sm-6 f-700 m-t-30'>{getMsg(messages.signUp.introduce, locale)}</p>
          <div className='col-sm-offset-3 col-sm-6'>
            <TextArea
              id='introduce'
              name='introduce'
              placeholder={getMsg(messages.signUp.introducePlaceholder, locale)}
              onChange={this._handleOnChangeInput}
              value={introduce}
              maxLength={80}
              autoSize
              disableEnter
            />
          </div>
          {
            !user.isSocialAccount &&
            <div>
              <p className='col-sm-offset-3 col-sm-6 f-700 m-t-30'>{getMsg(messages.setting.passwordChange, locale)}</p>
              <p className='col-sm-offset-3 col-sm-6 f-700 c-lightblue'>
                <Button size='xs' color='deeporange' text={getMsg(messages.setting.sendPasswordResetMail, locale)} icon='fa fa-envelope' onClick={this._handleOnClickSendPasswordResetEmail} />
              </p>
            </div>
          }
          <p className='col-sm-offset-3 col-sm-6 f-700 m-t-30 toggle-switch'>
            <label htmlFor='tutorial' className='ts-label f-700'>{getMsg(messages.setting.tutorial, locale)}</label><input type='checkbox' hidden='hidden' id='tutorial' onChange={this._handleOnChangeTutorial} /><label htmlFor='tutorial' className='ts-helper' />
          </p>
          <p className='col-sm-offset-3 col-sm-6 f-700 m-t-30'>{getMsg(messages.signUp.recommenderCode, locale)}</p>
          <p onClick={this._handleOnClickCodeCopy} style={{ cursor: 'pointer' }} className='col-sm-offset-3 col-sm-6 f-700 c-lightblue'>{user.recommenderCode} <i className='far fa-copy c-gray' /></p>
          <p className='col-sm-offset-3 col-sm-6 c-gray'><small>{getMsg(messages.setting.recommenderDetail, locale)}</small></p>
        </div>
      )
    }
    return (
      <ContentContainer
        header={
          <div>
            <h2 style={{ paddingRight: '60px' }}>{getMsg(messages.setting.guide, locale)}</h2>
            <ul className='actions' style={{ right: '20px' }}>
              <li><Button loading={isLoading} disabled={!isImageEdited && !isTextEdited} icon='fa fa-check' text={getMsg(messages.common.apply, locale)} color='blue' onClick={this._handleOnClickApply} /></li>
            </ul>
          </div>
        }
        stickyHeader
        title={getMsg(messages.setting.title, locale)}
        body={renderBody()}
      />
    )
  }
}

SettingView.contextTypes = {
  router: PropTypes.object.isRequired
}

SettingView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default SettingView
