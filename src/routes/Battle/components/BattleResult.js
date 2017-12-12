import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import MonCard from 'components/MonCard'
import UserInfo from './UserInfo'
import Button from 'components/Button'
import Loading from 'components/Loading'
import CenterMidContainer from 'components/CenterMidContainer'

import { updateUserInventory, setUserPath } from 'services/UserService'

import { getMsg } from 'utils/commonUtil'

class BattleResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSendingReward: true
    }
    this._getMissionCount = this._getMissionCount.bind(this)
    this._getMissionRewardItem = this._getMissionRewardItem.bind(this)
    this._sendReward = this._sendReward.bind(this)
    this._getStageRewardItem = this._getStageRewardItem.bind(this)
    this._getRewardName = this._getRewardName.bind(this)
  }
  componentDidMount () {
    this._sendReward()
  }
  _sendReward () {
    const { firebase, auth, user, stage, isAdventure, messages, locale, battleLog } = this.props
    let updateUserStage = () => Promise.resolve()
    // 스테이지의 no와 유저의 stage가 싱크가 맞지 않을 경우 스킵
    if (battleLog.winner === 'user' && isAdventure) {
      if ((user.stage || 1) !== stage.no) {
        this.setState({ isSendingReward: false })
        return window.swal({ text: getMsg(messages.battleView.rewardDuplicated, locale) })
      }
      updateUserStage = () => setUserPath(firebase, auth.uid, 'stage', (user.stage || 1) + 1)
    } else if (isAdventure) {
      this.setState({ isSendingReward: false })
      return
    }
    updateUserStage()
    .then(() => {
      return updateUserInventory(firebase, auth.uid, isAdventure ? this._getStageRewardItem() : this._getMissionRewardItem(),
      'save', isAdventure ? stage.quantity : this._getMissionCount())
    })
    .then(() => {
      this.setState({ isSendingReward: false })
    })
    .catch(msg => {
      this.setState({ isSendingReward: false })
      window.swal({ text: `보상 지급 중 에러가 발생했습니다. - ${msg}` })
    })
  }
  _getMissionCount () {
    const { battleLog } = this.props
    let cnt = 0
    if (battleLog.isPerfectGame) cnt++
    if (battleLog.isFirstDefense) cnt++
    if (battleLog.isGandang) cnt++
    if (battleLog.isOneMonShow) cnt++
    if (battleLog.isUnderDog) cnt++
    return cnt
  }
  _getMissionRewardItem () {
    const { items } = this.props
    return _.find(items, item => item.grades[0] === 'b' && item.grades[1] === 'r')
  }
  _getStageRewardItem () {
    const { stage, items } = this.props
    const stageGrades = stage.grades
    const result = _.find(items, item => {
      if (!item.grades) return false
      const diffLength = _.difference(item.grades, stageGrades).length
      return diffLength === 0
    })
    return result
  }
  _getRewardName () {
    const { locale, stage } = this.props
    return `${getMsg(this._getStageRewardItem().name, locale)} X ${stage.quantity}`
  }
  render () {
    const { user, enemy, battleLog, onClickContinue, battleResultInfo, auth, locale, items, isAdventure } = this.props
    const { isSendingReward } = this.state
    const renderBody = () => {
      if (!isAdventure && !battleResultInfo) return <CenterMidContainer bodyComponent={<Loading text='시합결과 반영 중...' />} />
      const { mom } = battleLog
      const { attackerPicks, defenderPicks, attacker } = battleLog.turns[battleLog.turns.length - 1]
      const renderCards = (picks, user) => {
        return picks.map((pick, idx) => {
          let isMom = false
          if (pick.col.id === mom.col.id) isMom = true
          return (
            <MonCard
              key={pick.col.id || pick.monId || idx}
              mon={{ tobe: pick.col }}
              isNotMine
              type='collection'
              user={user}
              kills={pick.kills}
              point={pick.point}
              isMom={isMom}
              locale={locale}
              noMonOfTheMatch={isAdventure}
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
      const renderPicks = (picks, user, type) => {
        let thisBattleResultInfo
        if (!isAdventure) {
          thisBattleResultInfo = type === 'user' ? {
            asis: this.props.battleResultInfo.asisUser,
            tobe: this.props.battleResultInfo.tobeUser
          } : {
            asis: this.props.battleResultInfo.asisEnemy,
            tobe: this.props.battleResultInfo.tobeEnemy
          }
        }
        return (
          <div className='row' style={{ marginBottom: '40px' }}>
            <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
              <UserInfo
                user={user}
                picks={picks.map(pick => pick.col)}
                isForResult={!isAdventure}
                isHidden={isAdventure}
                isForStage={isAdventure}
                battleResultInfo={!isAdventure ? thisBattleResultInfo : null}
                locale={locale}
                noButtons={isAdventure}
              />
            </div>
            {renderCards(picks, user)}
          </div>
        )
      }
      return (
        <div className='text-center'>
          {renderPicks(enemyPicks, enemy, 'enemy')}
          {renderPicks(userPicks, user, 'user')}
          {
            battleLog.winner === 'user' &&
            <div className='row'>
              <div className='col-md-6 col-md-offset-3' style={{ padding: '0px' }}>
                <div className='card pt-inner'>
                  {
                    !isAdventure &&
                    <div className='pti-header bgm-blue' style={{ padding: '10px 10px 55px' }}>
                      <h3 className='c-white'>미션 수행 결과</h3>
                      <div className='ptih-title'>{this._getMissionCount()}개의 미션 달성</div>
                    </div>
                  }
                  {
                    !isAdventure &&
                    <div className='pti-body'>
                      <div className='ptib-item'>퍼펙트게임: {battleLog.isPerfectGame ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                      <div className='ptib-item'>선방승리: {battleLog.isFirstDefense ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                      <div className='ptib-item'>원몬쇼: {battleLog.isOneMonShow ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                      <div className='ptib-item'>아슬아슬: {battleLog.isGandang ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                      <div className='ptib-item'>언더독: {battleLog.isUnderDog ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>}</div>
                    </div>
                  }
                  {
                    (this._getMissionCount() > 0 || isAdventure) &&
                    <div className='pti-footer'>
                      {isSendingReward && <Loading text='미션보상 전송 중...' height={80} />}
                      {!isSendingReward && !isAdventure &&
                        <div><span className='c-lightblue f-700'>{getMsg(this._getMissionRewardItem().name, locale)} X {this._getMissionCount()}</span>이 선물함으로 전송되었습니다.</div>
                      }
                      {
                        !isSendingReward && isAdventure &&
                        <div><span className='c-lightblue f-700'>{this._getRewardName()}</span>이 선물함으로 전송되었습니다.</div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          {
            isAdventure && user.adventureCredit > 0 &&
            <Button text='계속 모험하기' onClick={() => this.context.router.push('/adventure')} />
          }
          {
            !isAdventure && user.battleCredit > 0 &&
            <Button text='계속 시합하기' onClick={onClickContinue} />
          }
          {
            ((!isAdventure && user.battleCredit === 0) || (isAdventure && user.adventureCredit === 0)) &&
            <Button text='내 콜렉션' color='green' onClick={() => this.context.router.push(`/collection/${auth.uid}`)} />
          }
        </div>
      )
    }
    return (
      <div>
        <ContentContainer
          title='시합결과'
          body={renderBody()}
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
  onClickContinue: PropTypes.func.isRequired,
  battleResultInfo: PropTypes.object,
  auth: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  firebase: PropTypes.object.isRequired,
  isAdventure: PropTypes.bool,
  stage: PropTypes.object,
  messages: PropTypes.object.isRequired
}

export default BattleResult
