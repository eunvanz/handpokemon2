import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import Roulette from 'components/Roulette'
import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import Button from 'components/Button'

import { getPickMons } from 'services/MonService'
import { postCollection } from 'services/CollectionService'

import { PICK_MON_ROULETTE_DELAY } from 'constants/rules'

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
      result: null,
      renderFlag: true
    }
    this._initPick = this._initPick.bind(this)
    this._handleOnClickContinue = this._handleOnClickContinue.bind(this)
  }
  componentDidMount () {
    const { pickMonInfo, auth } = this.props
    if (!auth) return this.context.router.push('/sign-in')
    if (!pickMonInfo) return this.context.router.push('pick-district')
    this._initPick()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location.query.f !== this.props.location.query.f) this._initPick()
  }
  _initPick () {
    const { pickMonInfo, firebase, auth } = this.props
    const { quantity, attrs, grades } = pickMonInfo
    this.setState({ mode: quantity === 1 ? 'single' : 'multi' })
    let pickedMons = []
    const pickFuncArr = []
    for (let i = 0; i < quantity; i++) {
      pickFuncArr.push(getPickMons(firebase, attrs, grades))
    }
    Promise.all(pickFuncArr)
    .then(pickedMonsArr => {
      pickedMons = pickedMonsArr
      console.log('pickedMons', pickedMons)
      if (quantity === 1) {
        const picks = pickedMons[0]
        const pickedIdx = _.random(0, picks.length - 1)
        return postCollection(firebase, auth.uid, picks[pickedIdx])
        .then(result => {
          console.log('result', result)
          this.setState({ picks, pickedIdx, result })
          return Promise.resolve()
        })
      } else {
        const multiPicks = pickedMons.map(picks => picks[0])
        console.log('multiPicks', multiPicks)
        let results = []
        const postArr = multiPicks.map(pick => () => postCollection(firebase, auth.uid, pick))
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
  }
  _handleOnClickContinue () {
    this.setState({ multiPicks: null })
    let { f } = this.props.location.query
    if (f === '1') f = '0'
    else f = '1'
    this.context.router.push(`pick-mon?f=${f}`)
  }
  render () {
    const renderRoulette = () => {
      return (
        <div id='rouletteContainer'>
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
            flag={this.props.location.query.f || '-1'}
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
    const renderBody = () => {
      return (
        <div className='text-center'>
          <h4>야호! 새로운 포켓몬을 발견했어!<br />과연 어떤 친구일까?</h4>
          {
            this.state.pickedIdx > -1 && this.state.mode === 'single' && this.props.location.query.f === '1' &&
            renderRoulette()
          }
          {
            this.state.pickedIdx > -1 && this.state.mode === 'single' && this.props.location.query.f !== '1' &&
            renderRoulette()
          }
          {
            this.state.multiPicks && this.state.mode === 'multi' &&
            <div>
              <div className='row m-t-30'>
                {renderMultiPick()}
              </div>
              <div className='row'>
                <div className='text-center'>
                  <Button link text='돌아가기' className='m-r-5'
                    onClick={() => this.context.router.push('pick-district')} />
                  <Button text='계속채집' color='orange' onClick={this._handleOnClickContinue} />
                </div>
              </div>
            </div>
          }
          {
            ((this.state.pickedIdx < 0 && this.state.mode === 'single') || (!this.state.multiPicks && this.state.mode === 'multi')) &&
            <Loading
              text='채집 중...'
              height={277}
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
  pickMonInfo: PropTypes.object.isRequired,
  user: PropTypes.object,
  auth: PropTypes.object,
  location: PropTypes.object
}

export default PickMonView
