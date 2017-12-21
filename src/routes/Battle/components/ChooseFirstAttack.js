import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import CenterMidContainer from 'components/CenterMidContainer'
import GeneralRoulette from 'components/GeneralRoulette'
import Button from 'components/Button'

import { colors } from 'constants/colors'

import pawImage from './assets/paw.png'
import shieldImage from './assets/shield.png'

class ChooseFirstAttack extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSlowdown: false,
      isStopped: false,
      stopIdx: 0
    }
    this._handleOnClickStop = this._handleOnClickStop.bind(this)
    this._onSlowdownCallback = this._onSlowdownCallback.bind(this)
    this._onStopCallback = this._onStopCallback.bind(this)
  }
  componentDidMount () {
    const stopIdx = _.random(0, 1)
    this.setState({ stopIdx })
    const option = {
      speed: 8,
      duration: 10,
      stopImageNumber: stopIdx,
      slowDownCallback: this._onSlowdownCallback,
      stopCallback: this._onStopCallback
    }
    const { user, setTutorialModal } = this.props
    if (user && user.isTutorialOn && user.tutorialStep === 6) {
      setTutorialModal({
        show: true,
        content: <div>누가 먼저 공격을 할지 룰렛으로 결정해. 당연히 먼저 공격하는게 유리하니 <span className='c-lightblue'>STOP</span>버튼을 신중하게 눌러보라구.</div>,
        onClickContinue: () => {
          setTutorialModal({ show: false })
          window.$(`#firstAttackRoulette`).roulette(option).roulette('start')
        }
      })
    } else {
      window.$(`#firstAttackRoulette`).roulette(option).roulette('start')
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickStop () {
    window.$('#firstAttackRoulette').roulette('stop')
  }
  _onSlowdownCallback () {
    const { stopIdx } = this.state
    const { onSlowdownCallback } = this.props
    onSlowdownCallback(stopIdx)
    this.setState({ isSlowdown: true })
  }
  _onStopCallback () {
    const { user, setTutorialModal } = this.props
    const { stopIdx } = this.state
    this.setState({ isStopped: true, isSlowdown: false })
    if (user && user.isTutorialOn && user.tutorialStep === 6) {
      let content = <div>잘했어! 발바닥 모양은 공격을 의미해. 방패모양은 방어겠지? 먼저 공격하게 됐으니 시합이 유리해졌군! 그럼 <span className='c-lightblue'>시합시작</span> 버튼을 눌러보자.</div>
      if (stopIdx === 1) content = <div>이런.. 수비를 먼저 하게 됐군! 방패모양은 방어를 의미해. 발바닥 모양은 공격이겠지? 그럼 <span className='c-lightblue'>시합시작</span> 버튼을 눌러보자.</div>
      setTutorialModal({
        show: true,
        content: content,
        onClickContinue: () => {
          setTutorialModal({ show: false })
        }
      })
    }
  }
  render () {
    const { isStopped, isSlowdown } = this.state
    const { onClickStart, user } = this.props
    const renderBody = () => {
      return (
        <div>
          <h4>선공을 결정해야해.<br />신중하게 버튼을 눌러보라구.</h4>
          <GeneralRoulette
            id='firstAttackRoulette'
            images={[pawImage, shieldImage]}
            style={{ border: `3px solid ${colors.lightGray}`, borderRadius: '20px', margin: 'auto' }}
            size={220}
            innerSize={200}
          />
          <Button className={`m-t-30${user.isTutorialOn && user.tutorialStep === 6 ? ' blink-opacity' : ''}`} text={isStopped ? '시합시작' : 'STOP'} color={isStopped ? 'green' : isSlowdown ? 'orange' : 'red'} onClick={isStopped ? onClickStart : this._handleOnClickStop} disabled={this.state.isSlowdown} />
        </div>
      )
    }
    return (
      <ContentContainer
        title='선공 결정'
        body={<CenterMidContainer bodyComponent={renderBody()} />}
      />
    )
  }
}

ChooseFirstAttack.contextTypes = {
  router: PropTypes.object.isRequired
}

ChooseFirstAttack.propTypes = {
  onSlowdownCallback: PropTypes.func.isRequired,
  onClickStart: PropTypes.func.isRequired,
  setTutorialModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default ChooseFirstAttack
