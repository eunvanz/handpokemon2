import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import GeneralRoulette from 'components/GeneralRoulette'
import Img from 'components/Img'

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
    this._initAnimation = this._initAnimation.bind(this)
  }
  componentDidMount () {
    this._initAnimation()
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initAnimation () {
    const { battleLog } = this.props
    battleLog.turns.forEach(turn => {
      turn.attackerPickIdx
    })
  }
  render () {
    const { user, enemy, userPicks, enemyPicks } = this.props
    const renderMons = picks => {
      return picks.map((pick, idx) => {
        console.log('pick', pick)
        return (
          <div key={idx} className='col-xs-4 text-center'>
            <Img src={pick.mon[pick.monId].monImage[pick.imageSeq].url} style={{ width: isScreenSize.xs() ? '80%' : '50%', maxWidth: '120px' }} />
          </div>
        )
      })
    }
    const renderBody = () => {
      console.log('enemy', enemy)
      return (
        <div>
          <div className='row text-center m-b-30'>
            <div className='col-md-1 col-sm-2 col-xs-3 col-md-offset-4 col-sm-offset-2'>
              <p style={{ marginBottom: '10px' }}>
                <Img src={enemy.profileImage} className='mCS_img_loaded'
                  style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50px' : '80px', borderRadius: '50%' }} />
              </p>
            </div>
            <div className='col-md-1 col-sm-2 col-xs-3'>
              <GeneralRoulette
                images={enemyPicks.map(p => p.mon[p.monId].monImage[p.imageSeq])}
                id='enemyRoulette-1'
                style={rouletteStyle}
                size={isScreenSize.xs() ? 50 : 80}
                innerSize={isScreenSize.xs() ? 50 : 80}
              />
            </div>
            <div className='col-md-1 col-sm-2 col-xs-3'>
              <GeneralRoulette
                images={userPicks.map(p => p.mon[p.monId].monImage[p.imageSeq])}
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
          </div>
          <div className='row'>
            {renderMons(enemyPicks)}
          </div>
        </div>
      )
    }
    return (
      <ContentContainer
        title='시합 관전'
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
