import React from 'react'
import PropTypes from 'prop-types'

import ProgressBar from 'components/ProgressBar'

import { colors } from 'constants/colors'

class Stat extends React.Component {
  render () {
    const { value, label, addedValue1, addedValue2 } = this.props
    const renderStatStack = () => {
      return [value, addedValue1, addedValue2].map((val, idx) => {
        if (val === 0) return null
        let textColor = 'c-gray'
        if (idx === 1) textColor = 'c-orange'
        else if (idx === 2) textColor = 'c-lightblue'
        return <span key={idx} className={textColor}>{`${idx > 0 ? ' +' : ''}${val}`}</span>
      })
    }
    return (
      <div className='row' style={{ marginBottom: '10px' }}>
        <p className='col-xs-12 f-700' style={{ marginBottom: '0px' }}>{label} : {renderStatStack()}</p>
        <div className='col-xs-9' style={{ paddingTop: '9px' }}>
          <ProgressBar max={300} value={[value, addedValue1, addedValue2]} color={[colors.amber, colors.orange, colors.lightBlue]} />
        </div>
        <div className='col-xs-3 f-700'><span className='c-blue'>{value + addedValue1 + addedValue2}</span></div>
      </div>
    )
  }
}

Stat.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  addedValue1: PropTypes.number,
  addedValue2: PropTypes.number
}

export default Stat
