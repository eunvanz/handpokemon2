import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import keygen from 'keygenerator'

import ContentContainer from 'components/ContentContainer'
import Roulette from 'components/Roulette'
import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import Button from 'components/Button'

import { getPickMons, getNextMons } from 'services/MonService'
import { postCollection } from 'services/CollectionService'
import { decreaseCredit } from 'services/UserService'

import { PICK_MON_ROULETTE_DELAY, getMixGrades } from 'constants/rules'
import { attrs as allAttrs } from 'constants/data'

import { mergePickResults } from 'utils/monUtil'

class PickMonView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pickedIdx: -1,
      picks: null,
      mode: null,
      multiPicks: null,
      stop: false,
      result: null
    }
    this._initPick = this._initPick.bind(this)
    this._handleOnClickContinue = this._handleOnClickContinue.bind(this)
  }
  componentDidMount () {
    const { pickMonInfo, auth } = this.props
    if (!auth) return this.context.router.push('sign-in')
    console.log('pickMonInfo @ cdm in PickMonView', pickMonInfo)
    if (!pickMonInfo) return this.context.router.push('pick-district')
    this._initPick()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location.query.f !== this.props.location.query.f) this._initPick()
  }
  componentWillUnmount () {
    this.props.clearPickMonInfo()
  }
  _initPick () {
    const { pickMonInfo, firebase, auth, user } = this.props
    const { quantity, attrs, grades, evoluteCol, mixCols } = pickMonInfo
    if (!evoluteCol && !mixCols && quantity > user.pickCredit) {  // 유저의 크레딧보다 더 많은 포켓몬을 채집하는 경우
      this.context.router.push('pick-district')
      return
    }
    this.setState({ mode: quantity === 1 && (!evoluteCol || _.compact(evoluteCol.mon[evoluteCol.monId].next).length > 1) ? 'single' : 'multi' })
    let pickedMons = []
    const pickFuncArr = []
    if (!evoluteCol && !mixCols) { // 채집일때
      for (let i = 0; i < quantity; i++) {
        pickFuncArr.push(getPickMons(firebase, attrs, grades))
      }
      Promise.all(pickFuncArr)
      .then(pickedMonsArr => {
        pickedMons = pickedMonsArr
        if (quantity === 1) {
          const picks = pickedMons[0]
          const pickedIdx = _.random(0, picks.length - 1)
          return postCollection(firebase, auth.uid, picks[pickedIdx], 'pick')
            .then(result => {
              this.setState({ picks, pickedIdx, result })
              return Promise.resolve()
            })
        } else {
          const multiPicks = pickedMons.map(picks => picks[0])
          let results = []
          const postArr = multiPicks.map(pick => () => postCollection(firebase, auth.uid, pick, 'pick'))
          return postArr.reduce((prev, post) => prev.then(() => {
            return post()
              .then(result => {
                results.push(result)
                return Promise.resolve()
              })
          }), Promise.resolve())
          .then(() => {
            results = mergePickResults(results)
            this.setState({ multiPicks: results })
            return Promise.resolve()
          })
        }
      })
      .then(() => {
        // 유저의 채집 크레딧 감소
        return decreaseCredit(firebase, auth.uid, quantity, 'pick')
      })
    } else if (mixCols) { // 교배일때
      getPickMons(firebase, allAttrs, getMixGrades(mixCols), mixCols) // 마지막 파라미터는 특정 포켓몬 교배 처리를 위함
      .then(picks => {
        const pickedIdx = _.random(0, picks.length - 1)
        return postCollection(firebase, auth.uid, picks[pickedIdx], 'mix', mixCols)
        .then(result => {
          this.setState({ picks, pickedIdx, result })
          return Promise.resolve()
        })
      })
    } else if (evoluteCol) { // 진화일때
      getNextMons(firebase, evoluteCol)
      .then(nextMons => {
        const picks = _.compact(nextMons)
        if (picks.length > 1) { // 진화체가 여러개일 경우 단건채집과 같은방식으로 진행
          const pickedIdx = _.random(0, picks.length - 1)
          return postCollection(firebase, auth.uid, picks[pickedIdx], 'evolution', [evoluteCol])
          .then(result => {
            this.setState({ picks, pickedIdx, result })
            return Promise.resolve()
          })
        } else { // 진화체가 하나인 경우 다건체집 화면
          const multiPicks = picks
          return postCollection(firebase, auth.uid, multiPicks[0], 'evolution', [evoluteCol])
          .then(result => {
            this.setState({ multiPicks: [result] })
            return Promise.resolve()
          })
        }
      })
    }
  }
  _handleOnClickContinue () {
    const { pickMonInfo, user, receivePickMonInfo } = this.props
    this.setState({ multiPicks: null })
    if (this.state.mode === 'multi') {
      const newPickMonInfo = {
        quantity: user.pickCredit < pickMonInfo.quantity ? user.pickCredit : pickMonInfo.quantity,
        attrs: pickMonInfo.attrs,
        grades: ['b']
      }
      receivePickMonInfo(newPickMonInfo)
    }
    this.context.router.push(`pick-mon?f=${keygen._()}`)
  }
  render () {
    const { mode } = this.state
    const { user, pickMonInfo, auth, location } = this.props
    const renderBtnComponent = () => {
      return (
        <div className='text-center'>
          <Button link text='채집구역선택' className='m-r-5'
            onClick={() => this.context.router.push('pick-district')} />
          {user.pickCredit !== 0 && !pickMonInfo.evoluteCol && !pickMonInfo.mixCols &&
            <Button text={`계속채집 X ${renderQuantity()}`} color='orange' onClick={this._handleOnClickContinue} />}
          {(user.pickCredit === 0 || pickMonInfo.evoluteCol || pickMonInfo.mixCols) &&
            <Button text='내 콜렉션' color='green'
              onClick={() => this.context.router.push(`collection/${auth.uid}`)} />}
        </div>
      )
    }
    const renderRoulette = () => {
      return (
        <div id='rouletteContainer' key={location.query.f}>
          <Roulette
            images={this.state.picks.map(pick => pick.mon[pick.monId].monImage[0].url)}
            stopIdx={this.state.pickedIdx}
            size={220}
            innerSize={200}
            id='roulette'
            style={{ margin: 'auto' }}
            stop={this.state.stop}
            delay={PICK_MON_ROULETTE_DELAY}
            mon={this.state.result}
            btnComponent={renderBtnComponent()}
          />
        </div>
      )
    }
    const renderMultiPick = () => {
      const { multiPicks } = this.state
      let className = ''
      if (multiPicks.length === 4) className = 'col-md-offset-2'
      else if (multiPicks.length === 3) className = 'col-md-offset-3 col-sm-offset-1'
      else if (multiPicks.length === 2) className = 'col-md-offset-4 col-sm-offset-3'
      else if (multiPicks.length === 1) className = 'col-md-offset-5 col-sm-offset-4 col-xs-offset-3'
      else if (multiPicks.length === 5) className = 'col-md-offset-1'
      return multiPicks.map((pick, idx) => <MonCard mon={pick} pick
        className={idx === 0 ? className : null} key={idx} type='collection' />)
    }
    const renderQuantity = () => {
      if (mode === 'single') return 1
      else return user.pickCredit < pickMonInfo.quantity ? user.pickCredit : pickMonInfo.quantity
    }
    const renderBody = () => {
      return (
        <div className='text-center'>
          <h4>야호! 새로운 포켓몬을 발견했어!<br />과연 어떤 친구일까?</h4>
          {this.state.pickedIdx > -1 && this.state.mode === 'single' && renderRoulette()}
          {
            this.state.multiPicks && this.state.mode === 'multi' &&
            <div>
              <div className='row m-t-30'>
                {renderMultiPick()}
              </div>
              <div className='row'>
                {renderBtnComponent()}
              </div>
            </div>
          }
          {
            ((this.state.pickedIdx < 0 && this.state.mode === 'single') ||
            (!this.state.multiPicks && this.state.mode === 'multi')) &&
            <Loading
              text='채집 중...'
              height={mode === 'single' ? 277 : 337}
            />
          }
        </div>
      )
    }
    return (
      <ContentContainer
        title='포켓몬 채집'
        body={renderBody()}
        key={this.props.location.f}
      />
    )
  }
}

PickMonView.contextTypes = {
  router: PropTypes.object.isRequired
}

PickMonView.propTypes = {
  firebase: PropTypes.object.isRequired,
  pickMonInfo: PropTypes.object,
  user: PropTypes.object,
  auth: PropTypes.object,
  location: PropTypes.object,
  receivePickMonInfo: PropTypes.func.isRequired,
  clearPickMonInfo: PropTypes.func.isRequired
}

export default PickMonView
