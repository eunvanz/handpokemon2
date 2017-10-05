import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import numeral from 'numeral'

import { isScreenSize } from 'utils/commonUtil'

import { colors } from 'constants/colors'

class RankingElement extends React.Component {
  shouldUpdateComponent (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { user, rank, type, isMine } = this.props
    const lineHeight = isScreenSize.xs() ? '2.8' : '2.4'
    const fontSize = isScreenSize.xs() ? '14px' : '16px'
    const padding = isScreenSize.xs() ? '15px 5px' : '15px 30px'
    const width = [isScreenSize.xs() ? '20%' : '10%', isScreenSize.xs() ? '50%' : '20%', isScreenSize.xs() ? '30%' : '20%', isScreenSize.xs() ? '30%' : '20%', '10%', '10%', '10%']
    return (
      <div className='list-group-item media' style={{ height: '70px', padding, fontSize, border: isMine ? `1px solid ${colors.amber}` : '' }}>
        <div className='pull-left text-center' style={{ width: width[0], lineHeight }}>{numeral(rank).format('0,0')}</div>
        <div className='pull-left' style={{ width: width[1] }}>
          <img className='lgi-img hidden-xs' src={user.profileImage} />
          <span style={{ paddingLeft: '10px', lineHeight }}>{user.nickname}</span>
        </div>
        <div className={`pull-left text-center ${type === 'collection' ? '' : 'hidden-xs'}`} style={{ width: width[2], lineHeight }}><span className={type === 'collection' ? 'c-lightblue' : ''}>{numeral(user.colPoint).format('0,0')}</span>점</div>
        <div className={`pull-left text-center ${type === 'battle' ? '' : 'hidden-xs'}`} style={{ width: width[3], lineHeight }}><span className={type === 'battle' ? 'c-lightblue' : ''}>{numeral(user.leaguePoint).format('0,0')}</span>점</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[4], lineHeight }}><span className={type === 'battle' ? 'c-lightblue' : ''}>{numeral(user.battleWin).format('0,0')}</span>승</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[5], lineHeight }}><span className={type === 'battle' ? 'c-lightblue' : ''}>{numeral(user.battleLose).format('0,0')}</span>패</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[6], lineHeight }}><span className={type === 'battle' ? 'c-lightblue' : ''}>{numeral(user.battleWin * 100 / (user.battleWin + user.battleLose)).format('0.0')}</span>%</div>
      </div>
    )
  }
}

RankingElement.propTypes = {
  user: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  isMine: PropTypes.bool
}

export default RankingElement
