import React from 'react'
import PropTypes from 'prop-types'

import ProgressBar from 'components/ProgressBar'

import { colors } from 'constants/colors'

class Stat extends React.Component {
  render () {
    const { value, label, addedValue } = this.props
    return (
      <div className='row' style={{ marginBottom: '10px' }}>
        <p className='col-xs-12 f-700' style={{ marginBottom: '0px' }}>{label} : <span className='c-gray'>{value}</span></p>
        <div className='col-xs-9' style={{ paddingTop: '9px' }}>
          <ProgressBar max={300} value={value} color={colors.amber} />
        </div>
        <div className='col-xs-3 f-700'><span className='c-blue'>{value + addedValue}</span></div>
      </div>
    )
  }
}

Stat.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  addedValue: PropTypes.number
}

export default Stat
