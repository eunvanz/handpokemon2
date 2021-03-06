import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import MonCard from 'components/MonCard'
import UserInfo from './UserInfo'
import Button from 'components/Button'
import Loading from 'components/Loading'
import CenterMidContainer from 'components/CenterMidContainer'
import Info from 'components/Info'

import { updateUserInventory, setUserPath } from 'services/UserService'

import { getMsg } from 'utils/commonUtil'

class BattleResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSendingReward: true,
      rewardItem: null,
      rewardQuantity: null
    }
    this._getMissionCount = this._getMissionCount.bind(this)
    this._getMissionRewardItem = this._getMissionRewardItem.bind(this)
    this._sendReward = this._sendReward.bind(this)
    this._getStageRewardItem = this._getStageRewardItem.bind(this)
    this._getRewardName = this._getRewardName.bind(this)
  }
  componentDidMount () {
    this._sendReward()
    const { setTutorialModal, firebase, auth, user } = this.props
    if (user && user.isTutorialOn && user.tutorialStep === 6) {
      setTutorialModal({
        show: true,
        content: <div>시합이 끝났어! 스테이지를 클리어하게 되면 그에 따른 보상이 <span className='c-lightblue'>선물함</span>으로 발송되지.</div>,
        onClickContinue: () => {
          setTutorialModal({
            show: true,
            content: (
              <div>다른 트레이너들과 시합할 수 있는 <span className='c-lightblue'>포켓몬 시합</span>도 이와 비슷하게 진행되니 진행하는데에 어려움은 없을거야.</div>
            ),
            onClickContinue: () => {
              setTutorialModal({
                show: true,
                content: (
                  <div>나는 이만 들어가볼까 해. 어려운 일이 발생하면 언제든지 <span className='c-lightblue'>자유게시판</span>에 글을 남겨줘. 다른 할 일이 많으니 나는 이제 가볼게. 다음에 또 보자구!</div>
                ),
                onClickContinue: () => {
                  setUserPath(firebase, auth.uid, 'isTutorialOn', false)
                  setTutorialModal({
                    show: false
                  })
                }
              })
            }
          })
        }
      })
    }
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
      this.setState({ rewardQuantity: stage.quantity })
      updateUserStage = () => setUserPath(firebase, auth.uid, 'stage', (user.stage || 1) + 1)
    } else if (isAdventure) {
      this.setState({ isSendingReward: false })
      return
    }
    updateUserInventory(firebase, auth.uid, isAdventure ? this._getStageRewardItem() : this._getMissionRewardItem(),
      'save', isAdventure ? stage.quantity : this._getMissionCount())
    .then(() => {
      return updateUserStage()
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
    this.setState({ rewardItem: result })
    return result
  }
  _getRewardName () {
    const { locale } = this.props
    const { rewardItem, rewardQuantity } = this.state
    return `${getMsg(rewardItem.name, locale)} X ${rewardQuantity}`
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
                      <div className='ptib-item'>퍼펙트게임: {battleLog.isPerfectGame ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>} <Info id='perfectGameInfo' title='퍼펙트게임' content='내 포켓몬 중 기절한 포켓몬이 없이 승리' /></div>
                      <div className='ptib-item'>선방승리: {battleLog.isFirstDefense ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>} <Info id='firstDefenseInfo' title='선방승리' content='첫 턴에 방어부터 시작하고 승리' /></div>
                      <div className='ptib-item'>원몬쇼: {battleLog.isOneMonShow ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>} <Info id='oneMonShowInfo' title='원몬쇼' content='한 포켓몬이 모든 포켓몬을 마무리하며 승리' /></div>
                      <div className='ptib-item'>아슬아슬: {battleLog.isGandang ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>} <Info id='gandangInfo' title='아슬아슬' content='내 포켓몬의 남은 HP가 30 이하로 승리' /></div>
                      <div className='ptib-item'>언더독: {battleLog.isUnderDog ? <span className='c-green f-700'>달성</span> : <span className='c-red'>미달성</span>} <Info id='underDogInfo' title='언더독' content='상대보다 총 전투력이 낮은 상황에서 승리' /></div>
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
  messages: PropTypes.object.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default BattleResult
