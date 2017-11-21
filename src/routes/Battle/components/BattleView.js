import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'
import Loading from 'components/Loading'
import Step1 from './Step1'
import Step2 from './Step2'

class BattleView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1
    }
    this._handleOnClickStartBattle = this._handleOnClickStartBattle.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { clearBattle } = this.props
    clearBattle()
  }
  _handleOnClickStartBattle () {
    const { fetchCandidates, user, firebase } = this.props
    this.setState({ step: 2 })
    fetchCandidates(firebase, user.league)
    .then(() => {
      const { candidates } = this.props
      console.log('candidates', candidates)
    })
  }
  render () {
    const { step } = this.state
    const { user, candidates } = this.props
    const renderBody = () => {
      if (step === 1) {
        return (
          <Step1 user={user} onClickStart={this._handleOnClickStartBattle} />
        )
      } else if (step === 2) {
        return (
          <Step2 candidates={candidates} />
        )
      }
    }
    return renderBody()
  }
}

BattleView.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  fetchCandidates: PropTypes.func.isRequired,
  setEnemyPicks: PropTypes.func.isRequired,
  setUserPicks: PropTypes.func.isRequired,
  setBattleLog: PropTypes.func.isRequired,
  candidates: PropTypes.array,
  enemyPicks: PropTypes.array,
  userPicks: PropTypes.array,
  battleLog: PropTypes.object,
  clearBattle: PropTypes.func.isRequired
}

export default BattleView
