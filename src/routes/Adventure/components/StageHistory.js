import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'

import { colors } from 'constants/colors'

import { isScreenSize } from 'utils/commonUtil'

class StageHistory extends React.Component {
  componentDidMount () {
    const { scrollArea } = this.context
    const { stage } = this.props
    const width = window.innerWidth
    const scrollTo = stage * 100 - 100 - ((width - (isScreenSize.largerThan('md') ? 800 : 0)) / 2 - 100)
    setTimeout(() => scrollArea.scrollXTo(scrollTo), 500)
  }
  render () {
    const { stages, stage, getRewardItem } = this.props
    const renderStageHistory = () => sortBy(stages, ['no']).map((item, idx) => {
      return (
        <div key={item.no} className='text-center flex-center' style={{ width: '100px', textAlign: 'center', height: '25px', display: 'inline-block' }}>
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', backgroundColor: stage < item.no ? colors.lightGray : colors.blue, position: 'absolute', top: '7px', left: '43px' }} />
          <div style={{ display: 'inline-block', width: '50%', height: '10px', borderBottom: item.no === 1 ? null : `2px solid ${stage - 1 < idx ? colors.lightGray : colors.blue}` }} />
          <div style={{ display: 'inline-block', width: '50%', height: '10px', borderBottom: item.no === stages.length ? null : `2px solid ${stage <= item.no ? colors.lightGray : colors.blue}` }} />
          <img style={{ width: '50px', marginTop: '10px', opacity: stage - 1 < idx ? '.5' : null }} src={getRewardItem(stages.length - item.no).img} />
          <div className='c-lightblue' style={{ fontSize: '12px' }}>X {item.quantity}</div>
        </div>
      )
    })
    return (
      <div>
        {renderStageHistory()}
      </div>
    )
  }
}

StageHistory.contextTypes = {
  scrollArea: PropTypes.object.isRequired
}

StageHistory.propTypes = {
  stages: PropTypes.array.isRequired,
  stage: PropTypes.number.isRequired,
  getRewardItem: PropTypes.func.isRequired
}

export default StageHistory
