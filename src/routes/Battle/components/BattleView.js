import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'
import Loading from 'components/Loading'

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
      const renderStep1Body = () => {
        if (user.battleCredit > 0) {
          return (
            <div>
              <h4>시합을 시작할 준비가 됐나?<br />시합이 시작된 이후에 도망친다면 패배처리되니 조심하라구.</h4>
              <Button text='시합시작!' onClick={this._handleOnClickStartBattle} />
            </div>
          )
        } else {
          return (
            <div>
              <h4>시합 크레딧이 부족하군. 조금 기다렸다가 다시 도전해보라구.</h4>
            </div>
          )
        }
      }
      if (step === 1) {
        return (
          <CenterMidContainer bodyComponent={renderStep1Body()} />
        )
      } else if (step === 2) {
        if (candidates) {
          return (
            <div>
              상대를 찾음
            </div>
          )
        } else {
          return <CenterMidContainer bodyComponent={<Loading text='상대를 탐색 중...' />} />
        }
      }
    }
    return (
      <ContentContainer
        title={step === 1 ? '시합준비' : step === 2 ? '상대 선택' : step === 3 ? '출전 포켓몬 선택' : '포켓몬 시합'}
        body={renderBody()}
      />
    )
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
