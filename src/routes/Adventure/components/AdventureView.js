import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { find } from 'lodash'
import numeral from 'numeral'
import ScrollArea from 'react-scrollbar'

import { getMsg } from 'utils/commonUtil'

import { colors } from 'constants/colors'

import ContentContainer from 'components/ContentContainer'
import UserInfo from '../../Battle/components/UserInfo'
import MonCard from 'components/MonCard'
import LoadingContainer from 'components/LoadingContainer'
import StageHistory from './StageHistory'

import User from 'models/user'

import doctorOh from './assets/doctor_oh.png'

class AdventureView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: null,
      noMoreStage: false
    }
    this._handleOnClickNext = this._handleOnClickNext.bind(this)
    this._getTrainer = this._getTrainer.bind(this)
    this._getRewardName = this._getRewardName.bind(this)
    this._getTrainerImg = this._getTrainerImg.bind(this)
    this._getRewardItem = this._getRewardItem.bind(this)
  }
  componentDidMount () {
    const { stages, user, setTutorialModal } = this.props
    const stage = stages[stages.length - (user.stage || 1)]
    if (!stage) return this.setState({ noMoreStage: true })
    this.setState({ stage })
    if (user && user.isTutorialOn && user.tutorialStep === 6) {
      setTutorialModal({
        show: true,
        content: <div>포켓몬 탐험은 일종의 싱글플레이 개념입니다. 스테이지가 상승할수록 난이도도 높아지지만, 보상도 더욱 좋아지죠.</div>,
        onClickContinue: () => {
          setTutorialModal({
            show: true,
            content: <div>첫 단계는 쉬울테니 걱정하지 마세요. 그럼 어디 한 번 진행해봅시다!</div>,
            onClickContinue: () => {
              setTutorialModal({ show: false })
            }
          })
        }
      })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _getTrainer () {
    const { user, messages, locale } = this.props
    if ((user.stage || 1) <= 50) {
      return Object.assign({}, new User(), { nickname: getMsg(messages.adventure.trainerName[0], locale), profileImage: doctorOh })
    }
  }
  _getTrainerImg (stage) {
    if (stage <= 50) {
      return doctorOh
    }
  }
  _handleOnClickNext () {
    this.context.router.push('/battle?type=adventure')
  }
  _getRewardName (idx) {
    const { items, locale, stages } = this.props
    const stage = stages[idx]
    return `${getMsg(find(items, item => item.grades[0] === stage.grades[0] && item.grades[1] === stage.grades[1]).name, locale)} X ${stage.quantity}`
  }
  _getRewardItem (idx) {
    const { items, stages } = this.props
    const stage = stages[idx]
    return find(items, item => item.grades[0] === stage.grades[0] && item.grades[1] === stage.grades[1])
  }
  render () {
    const { messages, locale, user, stages } = this.props
    const { stage } = this.state
    if (!stage) return <LoadingContainer text={getMsg(messages.adventure.loadingStage, locale)} />
    const renderMonCards = () => {
      return stage.picks.map((defender, idx) => {
        return (
          <MonCard
            key={defender.monId}
            mon={{ tobe: defender }}
            isNotMine
            type='collection'
            user={this._getTrainer()}
          />
        )
      })
    }
    const renderHeader = () => {
      if (this.state.noMoreStage) return <div><h2>No More Stage</h2><small className='c-lightblue' style={{ fontSize: '14px' }}>{getMsg(messages.adventure.noMoreStageMessage, locale)}</small></div>
      return (
        <div><h2>Stage {user.stage || 1}<small className='c-lightblue' style={{ fontSize: '14px' }}>{renderGuide()}</small></h2></div>
      )
    }
    const renderBody = () => {
      if (this.state.noMoreStage) {
        return (
          <div />
        )
      }
      return (
        <div>
          <div className='row'>
            <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
              <UserInfo
                isHidden
                isForStage
                user={this._getTrainer()}
                onClickNext={this._handleOnClickNext}
                noButtons={user.adventureCredit <= 0}
                blinkNextButton={user.isTutorialOn && user.tutorialStep === 6}
              />
            </div>
            {renderMonCards()}
          </div>
          <div className='row m-t-20'>
            <div className='col-xs-12 text-center'>
              <p className='m-b-5'>{getMsg(messages.adventure.total, locale)} - <span className='c-lightblue f-700'>{numeral(stage.total).format('0,0')}</span></p>
              <p className='m-b-5'>{getMsg(messages.adventure.maxCost, locale)} - <span className='c-lightblue f-700'>{stage.maxCost}</span></p>
              <p className='m-b-5'>{getMsg(messages.adventure.reward, locale)} - <span className='c-lightblue f-700'>{this._getRewardName(stages.length - Number(user.stage))}</span></p>
            </div>
          </div>
          <div className='row m-t-20'>
            <ScrollArea
              horizontal
              style={{ height: '120px' }}
              contentStyle={{ width: `${stages.length * 100}px` }}
              smoothScrolling
            >
              <StageHistory stages={stages} stage={user.stage} getRewardItem={this._getRewardItem} />
            </ScrollArea>
          </div>
        </div>
      )
    }
    const renderGuide = () => {
      const userStage = user.stage || 1
      const keys = Object.keys(messages.adventure.guide)
      const filteredKeys = keys.filter(key => Number(key) < userStage)
      return getMsg(messages.adventure.guide[filteredKeys[filteredKeys.length - 1]], locale)
    }
    return (
      <ContentContainer
        title={getMsg(messages.sidebar.adventure, locale)}
        body={renderBody()}
        header={renderHeader()}
      />
    )
  }
}

AdventureView.contextTypes = {
  router: PropTypes.object.isRequired
}

AdventureView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  stages: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default AdventureView
