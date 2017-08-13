import React from 'react'
import PropTypes from 'prop-types'

class ProgressBar extends React.Component {
  render () {
    const { value, max, className, color, ...rest } = this.props
    const renderProgressBars = () => {
      return value.map((val, idx) => {
        return (
          <div className='progress-bar' role='progressbar' key={idx}
            aria-valuenow={`${val}`} aria-valuemin='0' aria-valuemax={`${max}`}
            style={{ width: `${val * 100 / max}%`, backgroundColor: color[idx] }}
          />
        )
      })
    }
    return (
      <div className={`progress ${className}`} {...rest}>
        {renderProgressBars()}
      </div>
    )
  }
}

ProgressBar.propTypes = {
  value: PropTypes.array,
  max: PropTypes.number,
  className: PropTypes.string,
  color: PropTypes.array
}

export default ProgressBar
