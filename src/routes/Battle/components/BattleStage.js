import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import wNumb from 'wnumb'

import ContentContainer from 'components/ContentContainer'
import GeneralRoulette from 'components/GeneralRoulette'
import Img from 'components/Img'
import MonUnit from './MonUnit'
import $ from 'jquery'

import { isScreenSize } from 'utils/commonUtil'
import { colors } from 'constants/colors'

import specialImage from './assets/fire.svg'
import normalImage from './assets/paw.png'

const rouletteStyle = {
  border: `3px solid ${colors.lightGray}`, borderRadius: isScreenSize.xs() ? '5px' : '20px', margin: 'auto'
}

class BattleStage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enemyPicks: props.battleLog.enemyPicks,
      userPicks: props.battleLog.userPicks
    }
    this._initAnimation = this._initAnimation.bind(this)
  }
  componentDidMount () {
    setTimeout(() => {
      const headerHeight = $('#header').height()
      const controllerHeight = $('#enemyController>div').height()
      const unitHeight = $('#enemy-0').height()
      const spaceHeight = window.innerHeight - headerHeight - (controllerHeight * 2) - (unitHeight * 2) - 260
      $('#space').css('height', spaceHeight)

      const slider = document.getElementById('speedSlider')
      slider.style.width = '90%'
      slider.style.margin = '30px auto 20px'
      const noUiSlider = window.noUiSlider
      noUiSlider.create(slider, {
        start: 2,
        connect: 'lower',
        range: {
          'min': 1,
          'max': 10
        },
        step: 1
      })

      this._initAnimation()
    }, 100)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initAnimation () {
    const { battleLog } = this.props
    battleLog.turns.forEach(turn => {
      const slider = document.getElementById('speedSlider')
      const speed = slider.noUiSlider.get()
      const speedVar = 1 / speed
      turn.attackerPickIdx
    })
  }
  render () {
    const { user, enemy, userPicks, enemyPicks } = this.props
    const renderController = type => {
      let myself = enemy
      let myPicks = enemyPicks
      let otherPicks = userPicks
      if (type === 'user') {
        myself = user
        myPicks = userPicks
        otherPicks = enemyPicks
      }
      return (
        <div id={`${type}Controller`}>
          {
            type === 'user' &&
            <div className='col-md-1 col-sm-2 col-xs-3 col-md-offset-4 col-sm-offset-2'>
              <p style={{ marginBottom: '10px' }}>
                <Img src={myself.profileImage} className='mCS_img_loaded'
                  style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50px' : '80px', borderRadius: '50%' }} />
              </p>
            </div>
          }
          <div className={`col-md-1 col-sm-2 col-xs-3${type === 'enemy' ? ' col-md-offset-4 col-sm-offset-2' : ''}`}>
            <GeneralRoulette
              images={myPicks.map(p => p.mon[p.monId].monImage[p.imageSeq])}
              id='enemyRoulette-1'
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : 80}
              innerSize={isScreenSize.xs() ? 50 : 80}
            />
          </div>
          <div className='col-md-1 col-sm-2 col-xs-3'>
            <GeneralRoulette
              images={otherPicks.map(p => p.mon[p.monId].monImage[p.imageSeq])}
              id='enemyRoulette-2'
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : 80}
              innerSize={isScreenSize.xs() ? 50 : 80}
            />
          </div>
          <div className='col-md-1 col-sm-2 col-xs-3'>
            <GeneralRoulette
              images={[normalImage, normalImage, specialImage]}
              id='enemyRoulette-3'
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : 80}
              innerSize={isScreenSize.xs() ? 50 : 80}
            />
          </div>
          {
            type === 'enemy' &&
            <div className='col-md-1 col-sm-2 col-xs-3'>
              <p style={{ marginBottom: '10px' }}>
                <Img src={myself.profileImage} className='mCS_img_loaded'
                  style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50px' : '80px', borderRadius: '50%' }} />
              </p>
            </div>
          }
        </div>
      )
    }
    const renderMons = picks => {
      return picks.map((pick, idx) => {
        return (
          <MonUnit mon={pick} key={idx} id={`enemy-${idx}`} />
        )
      })
    }
    const renderBody = () => {
      return (
        <div>
          <div className='row text-center m-b-30'>
            {renderController('enemy')}
          </div>
          <div className='row'>
            {renderMons(this.state.enemyPicks)}
          </div>
          <div id='space' />
          <div className='row'>
            {renderMons(this.state.userPicks)}
          </div>
          <div className='row text-center m-t-30'>
            {renderController('user')}
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div id='speedSlider' className='input-slider' />
            </div>
          </div>
        </div>
      )
    }
    return (
      <ContentContainer
        body={renderBody()}
      />
    )
  }
}

BattleStage.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleStage.propTypes = {
  battleLog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userPicks: PropTypes.array.isRequired,
  enemy: PropTypes.object.isRequired,
  enemyPicks: PropTypes.array.isRequired
}

export default BattleStage
