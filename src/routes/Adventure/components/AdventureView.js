import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { find } from 'lodash'
import numeral from 'numeral'

import { getMsg } from 'utils/commonUtil'

import ContentContainer from 'components/ContentContainer'
import UserInfo from '../../Battle/components/UserInfo'
import MonCard from 'components/MonCard'
import LoadingContainer from 'components/LoadingContainer'

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
  }
  componentDidMount () {
    const { stages, user } = this.props
    const stage = stages[stages.length - (user.stage || 1)]
    if (!stage) return this.setState({ noMoreStage: true })
    this.setState({ stage })
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
  _handleOnClickNext () {
    this.context.router.push('/battle?type=adventure')
  }
  _getRewardName () {
    const { items, locale } = this.props
    const { stage } = this.state
    return `${getMsg(find(items, item => item.grades[0] === 'b' && item.grades[1] === 'r').name, locale)} X ${stage.quantity}`
  }
  render () {
    const { messages, locale, user } = this.props
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
              />
            </div>
            {renderMonCards()}
          </div>
          <div className='row m-t-20'>
            <div className='col-xs-12 text-center'>
              <p className='m-b-5'>{getMsg(messages.adventure.total, locale)} - <span className='c-lightblue f-700'>{numeral(stage.total).format('0,0')}</span></p>
              <p className='m-b-5'>{getMsg(messages.adventure.maxCost, locale)} - <span className='c-lightblue f-700'>{stage.maxCost}</span></p>
              <p className='m-b-5'>{getMsg(messages.adventure.reward, locale)} - <span className='c-lightblue f-700'>{this._getRewardName()}</span></p>
            </div>
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
  items: PropTypes.array.isRequired
}

export default AdventureView
