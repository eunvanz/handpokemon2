import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import MonCard from 'components/MonCard'
import UserInfo from './UserInfo'
import Button from 'components/Button'

class BattleResult extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { user, enemy, battleLog, onClickContinue } = this.props
    const renderMomBody = () => {
      const { mom } = battleLog
      const { attackerPicks, defenderPicks, attacker } = battleLog.turns[battleLog.turns.length - 1]
      const getMissionCount = () => {
        let cnt = 0
        if (battleLog.isPerfectGame) cnt++
        if (battleLog.isFirstDefense) cnt++
        if (battleLog.isGandang) cnt++
        if (battleLog.isOneMonShow) cnt++
        if (battleLog.isUnderDog) cnt++
        return cnt
      }
      const renderCards = (picks, user) => {
        return picks.map(pick => {
          let isMom = false
          if (pick.col.id === mom.col.id) isMom = true
          return (
            <MonCard
              key={pick.col.id}
              mon={{ tobe: pick.col }}
              isNotMine
              type='collection'
              user={user}
              kills={pick.kills}
              point={pick.point}
              isMom={isMom}
            />
          )
        })
      }
      let userPicks = attackerPicks
      let enemyPicks = defenderPicks
      if (attacker !== 'user') {
        userPicks = defenderPicks
        enemyPicks = attackerPicks
      }
      const renderPicks = (picks, user) => {
        return (
          <div className='row' style={{ marginBottom: '40px' }}>
            <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
              <UserInfo
                user={user}
                picks={picks.map(pick => pick.col)}
                isForResult
              />
            </div>
            {renderCards(picks, user)}
          </div>
        )
      }
      return (
        <div className='text-center'>
          {renderPicks(enemyPicks, enemy)}
          {renderPicks(userPicks, user)}
          {
            battleLog.winner === 'user' &&
            <div className='row'>
              <div className='col-md-6 col-md-offset-3'>
                <div className='card pt-inner'>
                  <div className='pti-header bgm-green' style={{ padding: '10px 10px 55px' }}>
                    <h3 className='c-white'>미션 수행 결과</h3>
                    <div className='ptih-title'>{getMissionCount()}개의 미션 달성</div>
                  </div>
                  <div className='pti-body'>
                    <div className='ptib-item'>퍼펙트게임: {battleLog.isPerfectGame ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                    <div className='ptib-item'>선방승리: {battleLog.isFirstDefense ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                    <div className='ptib-item'>원몬쇼: {battleLog.isOneMonShow ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                    <div className='ptib-item'>아슬아슬: {battleLog.isGandang ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                    <div className='ptib-item'>언더독: {battleLog.isUnderDog ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                  </div>
                  {
                    getMissionCount() > 0 &&
                    <div className='pti-footer'>
                      <span className='c-lightblue'>베이직+레어 채집권 X {getMissionCount()}</span>이 선물함으로 전송되었습니다.
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          {
            user.battleCredit > 0 &&
            <Button text='계속 시합하기' onClick={onClickContinue} />
          }
        </div>
      )
    }
    return (
      <div>
        <ContentContainer
          title='시합결과'
          body={renderMomBody()}
        />
      </div>
    )
  }
}

BattleResult.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleResult.propTypes = {
  user: PropTypes.object.isRequired,
  enemy: PropTypes.object.isRequired,
  battleLog: PropTypes.object.isRequired,
  onClickContinue: PropTypes.func.isRequired
}

export default BattleResult
