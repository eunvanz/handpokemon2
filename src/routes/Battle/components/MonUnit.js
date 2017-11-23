import React from 'react'
import PropTypes from 'prop-types'

import { isScreenSize } from 'utils/commonUtil'
import { colors } from 'constants/colors'

import Img from 'components/Img'

class MonUnit extends React.PureComponent {
  render () {
    const { mon, ...props } = this.props
    return (
      <div className='col-xs-4 text-center' {...props}>
        <div className='progress' style={{ margin: 'auto', width: isScreenSize.xs() ? '64%' : '40%', maxWidth: '96px', marginBottom: isScreenSize.xs() ? '5px' : '10px' }}>
          <div className='progress-bar' style={{ backgroundColor: colors.amber, width: `${(mon.restHp * 100) / mon.totalHp}%` }} />
          <div className='progress-bar' style={{ backgroundColor: colors.red, width: `${((mon.totalHp - mon.restHp) * 100) / mon.totalHp}%` }} />
        </div>
        <Img src={mon.col.mon[mon.col.monId].monImage[mon.col.imageSeq].url} style={{ width: isScreenSize.xs() ? '80%' : '50%', maxWidth: '120px' }} />
        <div style={{ margin: 'auto', fontSize: isScreenSize.xs() ? '10px' : '12px', marginTop: isScreenSize.xs() ? '5px' : '10px' }}>{mon.restHp} / {mon.totalHp}</div>
      </div>
    )
  }
}

MonUnit.propTypes = {
  mon: PropTypes.object.isRequired
}

export default MonUnit
