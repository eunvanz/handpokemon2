import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import numeral from 'numeral'
import $ from 'jquery'

import { isScreenSize } from 'utils/commonUtil'

import { colors } from 'constants/colors'

class RankingElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lineHeight: isScreenSize.xs() ? '2.8' : '2.4',
      fontSize: isScreenSize.xs() ? '14px' : '16px',
      padding: isScreenSize.xs() ? '15px 5px' : '15px 30px',
      width: [isScreenSize.xs() ? '20%' : isScreenSize.sm() ? '15%' : '10%', isScreenSize.xs() ? '50%' : isScreenSize.sm() ? '35%' : '20%', isScreenSize.xs() ? '30%' : isScreenSize.sm() ? '25%' : '20%', isScreenSize.xs() ? '30%' : isScreenSize.sm() ? '25%' : '20%', '10%', '10%', '10%'],
      showProfile: !isScreenSize.smallerThan(414) // 아이폰6+ 부터 트레이너 프로필 이미지 보여줌
    }
    this._adjustStyle = this._adjustStyle.bind(this)
  }
  componentDidMount () {
    $(window).on('resize', () => {
      this._adjustStyle()
    })
  }
  shouldUpdateComponent (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    $(window).off('resize')
  }
  _adjustStyle () {
    this.setState({
      lineHeight: isScreenSize.xs() ? '2.8' : '2.4',
      fontSize: isScreenSize.xs() ? '14px' : '16px',
      padding: isScreenSize.xs() ? '15px 5px' : '15px 30px',
      width: [isScreenSize.xs() ? '20%' : isScreenSize.sm() ? '15%' : '10%', isScreenSize.xs() ? '50%' : isScreenSize.sm() ? '35%' : '20%', isScreenSize.xs() ? '30%' : isScreenSize.sm() ? '25%' : '20%', isScreenSize.xs() ? '30%' : isScreenSize.sm() ? '25%' : '20%', '10%', '10%', '10%'],
      showProfile: !isScreenSize.smallerThan(414)
    })
  }
  render () {
    const { user, rank, type, isMine, isHeader } = this.props
    const { lineHeight, fontSize, padding, width, showProfile } = this.state
    return (
      <div className='list-group-item media' style={{ height: '70px', padding, fontSize, border: isMine ? `1px solid ${colors.amber}` : '' }}>
        <div className='pull-left text-center' style={{ width: width[0], lineHeight }}>{isHeader ? <strong>순위</strong> : numeral(rank).format('0,0')}</div>
        <div className={`pull-left ${isHeader ? 'text-center' : ''}`} style={{ width: width[1] }}>
          {isHeader
            ? <strong style={{ lineHeight }}>트레이너</strong>
            : <div onClick={() => this.context.router.push(`/collection/${user.id}`)} style={{ cursor: 'pointer' }}>
              <img className='lgi-img' src={user.profileImage} style={{ display: showProfile ? 'inline' : 'none' }} />
              <span style={{ paddingLeft: '10px', lineHeight }}>{user.nickname}</span>
            </div>
          }
        </div>
        <div className={`pull-left text-center ${type === 'collection' ? '' : 'hidden-xs'}`} style={{ width: width[2], lineHeight }}><span className={type === 'collection' && !isHeader ? 'c-lightblue' : ''}>{isHeader ? <strong>콜렉션점수</strong> : numeral(user.colPoint).format('0,0')}</span>{isHeader ? '' : '점'}</div>
        <div className={`pull-left text-center ${type === 'battle' ? '' : 'hidden-xs'}`} style={{ width: width[3], lineHeight }}><span className={type === 'battle' && !isHeader ? 'c-lightblue' : ''}>{isHeader ? <strong>시합점수</strong> : numeral(user.leaguePoint).format('0,0')}</span>{isHeader ? '' : '점'}</div>
        <div className='pull-left text-center hidden-sm hidden-xs' style={{ width: width[4], lineHeight }}><span className={type === 'battle' && !isHeader ? 'c-lightblue' : ''}>{isHeader ? <strong>승</strong> : numeral(user.battleWin).format('0,0')}</span>{isHeader ? '' : '승'}</div>
        <div className='pull-left text-center hidden-sm hidden-xs' style={{ width: width[5], lineHeight }}><span className={type === 'battle' && !isHeader ? 'c-lightblue' : ''}>{isHeader ? <strong>패</strong> : numeral(user.battleLose).format('0,0')}</span>{isHeader ? '' : '패'}</div>
        <div className='pull-left text-center hidden-sm hidden-xs' style={{ width: width[6], lineHeight }}><span className={type === 'battle' && !isHeader ? 'c-lightblue' : ''}>{isHeader ? <strong>승률</strong> : numeral(user.battleWin * 100 / (user.battleWin + user.battleLose)).format('0.0')}</span>{isHeader ? '' : '%'}</div>
      </div>
    )
  }
}

RankingElement.contextTypes = {
  router: PropTypes.object.isRequired
}

RankingElement.propTypes = {
  user: PropTypes.object,
  rank: PropTypes.number,
  type: PropTypes.string,
  isMine: PropTypes.bool,
  isHeader: PropTypes.bool
}

export default RankingElement
