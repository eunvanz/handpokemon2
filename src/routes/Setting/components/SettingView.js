import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import TextArea from 'components/TextArea'
import AvatarImgInput from 'components/AvatarImgInput'
import WarningText from 'components/WarningText'
import Button from 'components/Button'

import { getMsg, isIE } from 'utils/commonUtil'

class SettingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      introduce: props.user.introduce,
      profileImage: props.user.profileImage,
      isEdited: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnChangeInput (e) {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  _handleOnClickApply () {

  }
  render () {
    const { messages, locale, user } = this.props
    const { profileImage, introduce, isEdited } = this.state
    const renderBody = () => {
      return (
        <div className='row'>
          <p className='col-sm-offset-3 col-sm-6 f-700'>{getMsg(messages.signUp.profileImage, locale)}</p>
          <div className='col-sm-12 text-center'>
            {!isIE() && <AvatarImgInput image={profileImage} onChange={() => this.setState({ profileImage: null })} />}
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
          <p className='col-sm-offset-3 col-sm-6 f-700 m-t-30'>{getMsg(messages.signUp.recommenderCode, locale)}</p>
          <p className='col-sm-offset-3 col-sm-6'>{user.recommenderCode}</p>
        </div>
      )
    }
    return (
      <ContentContainer
        header={
          <div>
            <h2 style={{ paddingRight: '60px' }}>{getMsg(messages.setting.guide, locale)}</h2>
            <ul className='actions' style={{ right: '20px' }}>
              <li><Button disabled={!isEdited} icon='fa fa-check' text={getMsg(messages.common.apply, locale)} color='blue' onClick={this._handleOnClickApply} /></li>
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
