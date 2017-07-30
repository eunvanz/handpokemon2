import React from 'react'
import PropTypes from 'prop-types'

class Loading extends React.Component {
  render () {
    return (
      <div className='text-center' style={{ height: `${this.props.height}px` }}>
        <div className='preloader' style={{ top: `${this.props.height / 2 - 20}px` }}>
          <svg className='pl-circular' viewBox='25 25 50 50'>
            <circle className='plc-path' cx='50' cy='50' r='20' />
          </svg>
        </div>
        {this.props.text && <div style={{ position: 'relative', top: `${this.props.height / 2 - 15}px`, fontSize: '14px' }}>{this.props.text}</div>}
      </div>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string,
  height: PropTypes.number
}

export default Loading
