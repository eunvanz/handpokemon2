import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { fromJS, is } from 'immutable'
import numeral from 'numeral'

import CustomModal from '../CustomModal'
import MonCard from '../MonCard'
import Button from '../Button'

import withIntl from 'hocs/withIntl'

import { LEAGUE } from 'constants/rules'

import { getHonorBurf, getHonorBurfTotal, getMsg } from 'utils/commonUtil'

class DefenderModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      asis: props.defenders,
      tobe: props.defenders,
      asisTotalCost: props.defenders.reduce((accm, defender) => accm + defender.mon[defender.monId].cost, 0),
      totalCost: props.defenders.reduce((accm, defender) => accm + defender.mon[defender.monId].cost, 0),
      totalBattle: props.defenders.reduce((accm, defender) => accm + defender.total + defender.addedTotal, 0)
    }
    this._handleOnClickApply = this._handleOnClickApply.bind(this)
    this._handleOnClickSetDefender = this._handleOnClickSetDefender.bind(this)
    this._handleOnClickCancel = this._handleOnClickCancel.bind(this)
    this._initState = this._initState.bind(this)
    this._isInTobe = this._isInTobe.bind(this)
    this._isJustForCheck = this._isJustForCheck.bind(this)
    this._updateInfos = this._updateInfos.bind(this)
    this._getMaxCost = this._getMaxCost.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentDidUpdate (prevProps, prevState) {
    if (!is(fromJS(prevProps.defenders), fromJS(this.props.defenders))) this._initState()
    if (!is(fromJS(prevState.tobe), fromJS(this.state.tobe))) this._updateInfos()
  }
  _initState () {
    const { defenders } = this.props
    this.setState({
      asis: defenders,
      tobe: defenders,
      asisTotalCost: defenders.reduce((accm, defender) => accm + defender.mon[defender.monId].cost, 0),
      totalCost: defenders.reduce((accm, defender) => accm + defender.mon[defender.monId].cost, 0),
      totalBattle: defenders.reduce((accm, defender) => accm + defender.total, 0)
    })
  }
  _updateInfos () {
    const { tobe } = this.state
    this.setState({
      totalCost: tobe.reduce((accm, defender) => accm + defender.mon[defender.monId].cost, 0),
      totalBattle: tobe.reduce((accm, defender) => accm + defender.total, 0)
    })
  }
  _handleOnClickApply () {
    const { onClickApply } = this.props
    onClickApply(this.state)
  }
  _handleOnClickSetDefender (e, idx) {
    e.preventDefault()
    e.stopPropagation()
    const { asis } = this.state
    const { currentCol } = this.props
    const tobe = asis.slice()
    tobe[idx] = currentCol
    this.setState({ tobe })
  }
  _handleOnClickCancel () {
    const { close } = this.props
    this.setState({ tobe: this.state.asis })
    close()
  }
  _isInTobe (col) {
    const { tobe } = this.state
    return tobe.filter(defender => defender.id === col.id).length > 0
  }
  _isInAsis (col) {
    const { asis } = this.state
    return asis.filter(defender => defender.id === col.id).length > 0
  }
  _isJustForCheck () {
    const { currentCol } = this.props
    return currentCol && this._isInAsis(currentCol)
  }
  _getMaxCost () {
    const { user } = this.props
    return LEAGUE[user.league || 0].maxCost
  }
  _isChangeable (tgtCost) {
    const { currentCol } = this.props
    if (!currentCol) return false
    const srcCost = currentCol.mon[currentCol.monId].cost
    const maxCost = this._getMaxCost()
    const { asisTotalCost } = this.state
    return asisTotalCost - tgtCost + srcCost <= maxCost
  }
  render () {
    const { show, close, isLoading, currentCol, user, locale, messages } = this.props
    const { tobe } = this.state
    const renderMonCards = () => {
      const result = []
      let occupied = 0
      result.push(tobe.map((col, idx) => {
        occupied++
        return (
          <MonCard
            mon={{ asis: null, tobe: col }}
            type={this._isJustForCheck() ? 'collection' : 'defender'}
            onClickSetDefenderBtn={(e) => this._handleOnClickSetDefender(e, idx)}
            className={`col-md-4 col-sm-4 col-xs-6`}
            isCustomSize
            key={idx}
            user={user}
            disableChangeBtn={!this._isChangeable(col.mon[col.monId].cost)}
          />
        )
      }
      ))
      for (let i = occupied; i < 3; i++) {
        result.push(
          <MonCard
            isDummy
            type={currentCol && this._isInAsis(currentCol) ? 'collection' : 'defender'}
            onClickSetDefenderBtn={(e) => this._handleOnClickSetDefender(e, i)}
            className={`col-md-4 col-sm-4 col-xs-6`}
            isCustomSize
            key={i}
            user={user}
            disableChangeBtn={!this._isChangeable(0)}
          />
        )
      }
      return result
    }
    const renderBody = () => {
      return (
        <div className='row'>
          {
            currentCol && !this._isJustForCheck() &&
            <div className='col-xs-12 m-b-20'>
              <span className='c-lightblue f-700'>{getMsg(currentCol.mon[currentCol.monId].name, locale)} LV.{currentCol.level}</span>을(를) 배치할 위치를 선택해주세요.
            </div>
          }
          {renderMonCards()}
          <div className='col-xs-12'>
            <div>
              총 코스트: <span className='c-lightblue f-700'>{this.state.totalCost}</span>/{this._getMaxCost()}
            </div>
            <div>
              총 전투력: <span className='c-lightblue f-700'>{numeral(this.state.totalBattle + getHonorBurfTotal(getHonorBurf(user)) * 3).format('0,0')}</span>
            </div>
          </div>
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          {
            !this._isJustForCheck() &&
            <Button link text='취소' onClick={this._handleOnClickCancel} />
          }
          {
            !this._isJustForCheck() &&
            <Button text='적용하기' icon='fa fa-check' loading={isLoading}
              onClick={this._handleOnClickApply} />
          }
          {
            this._isJustForCheck() &&
            <Button text='확인' icon='fa fa-check'
              onClick={close} />
          }
        </div>
      )
    }
    return (
      <CustomModal
        title='수비 포켓몬 배치'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        show={show}
        close={close}
        backdrop
        width={500}
        id='defender-modal'
      />
    )
  }
}

DefenderModal.contextTypes = {
  router: PropTypes.object.isRequired
}

DefenderModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onClickApply: PropTypes.func.isRequired,
  defenders: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  currentCol: PropTypes.object,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default withIntl(DefenderModal)
