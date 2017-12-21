import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import Img from 'components/Img'

import woongImg from './assets/KakaoTalk_2017-12-21-11-30-42_Photo_14.png'

class TutorialModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { content, isHiddenImg, onClickContinue, show, close } = this.props
    const renderBody = () => {
      return (
        <div>
          {
            !isHiddenImg &&
            <div className='row'>
              <div className='col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 m-b-15'>
                <Img src={woongImg} width='100%' />
              </div>
            </div>
          }
          {content}
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div>
          <Button
            text='튜토리얼 종료'
            onClick={close}
            link
          />
          <Button
            icon='fa fa-arrow-right'
            className='m-l-5'
            text='계속하기'
            onClick={onClickContinue}
          />
        </div>
      )
    }
    return (
      <CustomModal
        title='튜토리얼'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        show={show}
        close={close}
        backdrop='static'
      />
    )
  }
}

TutorialModal.propTypes = {
  content: PropTypes.element,
  onClickContinue: PropTypes.func,
  show: PropTypes.bool,
  close: PropTypes.func,
  isHiddenImg: PropTypes.bool
}

export default TutorialModal
