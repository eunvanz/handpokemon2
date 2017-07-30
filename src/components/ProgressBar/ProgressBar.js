import React from 'react'
import PropTypes from 'prop-types'

class ProgressBar extends React.Component {
  render () {
    const { value, max, className, color, ...rest } = this.props
    return (
      <div className={`progress ${className}`} {...rest}>
        <div className='progress-bar' role='progressbar'
          aria-valuenow={`${value}`} aria-valuemin='0' aria-valuemax={`${max}`}
          style={{ width: `${value * 100 / max}%`, backgroundColor: color }}
        />
      </div>
    )
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  color: PropTypes.string
}

export default ProgressBar
