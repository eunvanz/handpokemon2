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
      isStopped: false
    }
    this._handleOnClickStop = this._handleOnClickStop.bind(this)
    this._onSlowdownCallback = this._onSlowdownCallback.bind(this)
    this._onStopCallback = this._onStopCallback.bind(this)
  }
  componentDidMount () {
    const option = {
      speed: 8,
      duration: 10,
      stopImageNumber: _.random(0, 1),
      slowDownCallback: this._onSlowdownCallback,
      stopCallback: this._onStopCallback
    }
    window.$(`#firstAttackRoulette`).roulette(option).delay(10000).roulette('start')
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickStop () {
    window.$('#firstAttackRoulette').roulette('stop')
  }
  _onSlowdownCallback () {
    this.setState({ isSlowdown: true })
  }
  _onStopCallback () {
    const { onStopCallback } = this.props
    const { stopIdx } = this.state
    this.setState({ isStopped: true, isSlowdown: false })
    onStopCallback(stopIdx)
  }
  render () {
    const { isStopped, isSlowdown } = this.state
    const { onClickStart } = this.props
    const renderBody = () => {
      return (
        <div>
          <h4>선공을 결정해야해.<br />신중하게 버튼을 눌러보라구.</h4>
          <GeneralRoulette
            id='firstAttackRoulette'
            images={[pawImage, shieldImage]}
            stopIdx={this.state.stopIdx}
            onSlowdown={this._onSlowdownCallback}
            onStop={this._onStopCallback}
            style={{ border: `3px solid ${colors.lightGray}`, borderRadius: '20px', margin: 'auto' }}
            size={220}
            innerSize={200}
          />
          <Button className='m-t-30' text={isStopped ? '시합시작' : 'STOP'} color={isStopped ? 'green' : isSlowdown ? 'orange' : 'red'} onClick={isStopped ? onClickStart : this._handleOnClickStop} disabled={this.state.isSlowdown} />
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
  onStopCallback: PropTypes.func.isRequired,
  onClickStart: PropTypes.func.isRequired
}

export default ChooseFirstAttack
