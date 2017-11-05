import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import numeral from 'numeral'

import { isScreenSize } from 'utils/commonUtil'

import { colors } from 'constants/colors'

class RankingHeader extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { type } = this.props
    const lineHeight = isScreenSize.xs() ? '2.8' : '2.4'
    const fontSize = isScreenSize.xs() ? '14px' : '16px'
    const padding = isScreenSize.xs() ? '15px 5px' : '15px 30px'
    const width = [isScreenSize.xs() ? '20%' : '10%', isScreenSize.xs() ? '50%' : '20%', isScreenSize.xs() ? '30%' : '20%', isScreenSize.xs() ? '30%' : '20%', '10%', '10%', '10%']
    return (
      <div className='list-group-item media' style={{ height: '70px', padding, fontSize, fontWeight: '700', backgroundColor: '#ffffff', borderBottom: '1px solid #F7F7F7' }}>
        <div className='pull-left text-center' style={{ width: width[0], lineHeight }}>순위</div>
        <div className='pull-left text-center' style={{ width: width[1], lineHeight }}>
          트레이너
        </div>
        <div className={`pull-left text-center ${type === 'collection' ? '' : 'hidden-xs'}`} style={{ width: width[2], lineHeight }}>콜렉션점수</div>
        <div className={`pull-left text-center ${type === 'battle' ? '' : 'hidden-xs'}`} style={{ width: width[3], lineHeight }}>시합점수</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[4], lineHeight }}>승</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[5], lineHeight }}>패</div>
        <div className='pull-left text-center hidden-xs' style={{ width: width[6], lineHeight }}>승률</div>
      </div>
    )
  }
}

RankingHeader.propTypes = {
  type: PropTypes.string.isRequired
}

export default RankingHeader
