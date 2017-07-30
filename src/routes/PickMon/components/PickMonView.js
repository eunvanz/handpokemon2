import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import Roulette from 'components/Roulette'
import Loading from 'components/Loading'
import Button from 'components/Button'

import { getPickMons } from 'services/MonService'
import { postCollection } from 'services/CollectionService'

import { PICK_MON_ROULETTE_DELAY } from 'constants/rules'

class PickMonView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pickedIdx: -1,
      picks: null,
      mode: null,
      multiPicks: null,
      stop: false
    }
    this._handleOnClickStop = this._handleOnClickStop.bind(this)
  }
  componentDidMount () {
    const { pickMonInfo } = this.props
    if (!pickMonInfo) return this.context.router.push('pick-district')
    const { quantity, attrs, grades } = pickMonInfo
    this.setState({ mode: quantity === 1 ? 'single' : 'multi' })
    let pickedMons = []
    const pickFuncArr = []
    for (let i = 0; i < quantity; i++) {
      pickFuncArr.push(getPickMons(attrs, grades))
    }
    Promise.all(pickFuncArr)
    .then(pickedMonsArr => {
      pickedMons = pickedMonsArr
      if (quantity === 1) {
        const picks = pickedMons[0]
        const pickedIdx = _.random(0, picks.length - 1)
        return postCollection(picks[pickedIdx], this.props.user.id)
        .then(() => {
          this.setState({ picks, pickedIdx })
          return Promise.resolve()
        })
      } else {
        const multiPicks = pickedMons.map(picks => picks[0])
        return Promise.all(multiPicks.map(pick => postCollection(pick, this.props.user.id)))
        .then(() => {
          this.setState({ multiPicks })
          return Promise.resolve()
        })
      }
    })
    .then(() => {
      setTimeout(this._handleOnClickStop, PICK_MON_ROULETTE_DELAY)
    })
  }
  _handleOnClickStop () {
    if (!this.state.stop) this.setState({ stop: true })
  }
  render () {
    const renderBody = () => {
      return (
        <div className='text-center'>
          <h4>야호! 새로운 포켓몬을 발견했어!<br />과연 어떤 친구일까?</h4>
          {
            this.state.pickedIdx > -1 && this.state.mode === 'single' &&
            <div>
              <Roulette
                images={this.state.picks.map(pick => pick.mon.monImage[0].url)}
                stopIdx={this.state.pickedIdx}
                size={220}
                innerSize={200}
                id='roulette'
                style={{ margin: 'auto' }}
                stop={this.state.stop}
                delay={PICK_MON_ROULETTE_DELAY}
              />
              <div className='m-20' />
              <Button text='STOP' onClick={this._handleOnClickStop} disabled={this.state.stop} />
            </div>
          }
          {
            this.state.multiPicks && this.state.mode === 'multi' &&
            <div>ss</div>
          }
          {
            ((this.state.pickedIdx < 0 && this.state.mode === 'single') ||
            (this.state.multiPicks && this.state.mode === 'multi')) &&
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
      />
    )
  }
}

PickMonView.contextTypes = {
  router: PropTypes.object.isRequired
}

PickMonView.propTypes = {
  pickMonInfo: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default PickMonView
