import React from 'react'
import PropTypes from 'prop-types'
import keygen from 'keygenerator'
import shallowCompare from 'react-addons-shallow-compare'

import Loading from 'components/Loading'

class PieChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = { key: keygen._(), isInitialized: false }
    this._initialize = this._initialize.bind(this)
  }
  componentDidMount () {
    // this._initialize()
    setTimeout(() => this._initialize(), 1)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initialize () {
    const $ = window.$

    function easyPieChart (id, trackColor, scaleColor, barColor, lineWidth, lineCap, size) {
      $('#' + id).easyPieChart({
        trackColor: trackColor,
        scaleColor: scaleColor,
        barColor: barColor,
        lineWidth: lineWidth,
        lineCap: lineCap,
        size: size
      })
    }

    easyPieChart(this.state.key, this.props.trackColor, false, this.props.barColor, 2, 'butt', 100)
    // console.log('isInitialized to be true')
    this.setState({ isInitialized: true })
  }
  render () {
    const { sub, total, label, trackColor, barColor, ...rest } = this.props
    const { isInitialized } = this.state
    // console.log('sub', sub)
    // console.log('total', total)
    // console.log('this.state.isInitialized', this.state.isInitialized)
    return (
      <div className='col-md-2 col-sm-3 col-xs-6 text-center m-b-30' {...rest}>
        {
          !isInitialized && <Loading height={114} />
        }
        <div className='easy-pie sub-pie-1' id={this.state.key} data-percent={sub * 100 / total}
          style={{ display: isInitialized ? 'block' : 'none' }}>
          <div className='percent c-gray ' style={{ marginTop: '40px', left: '0px', fontSize: '20px' }}>
            {isInitialized && <span>{sub} / {total}</span>}
          </div>
          <div className='pie-title m-t-10' style={{ bottom: '-13px' }}>{label}</div>
          {isInitialized && <div className='pie-title m-t-10' style={{ bottom: '-13px' }}>{label}</div>}
        </div>
      </div>
    )
  }
}

PieChart.contextTypes = {
  router: PropTypes.object.isRequired
}

PieChart.propTypes = {
  sub: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  trackColor: PropTypes.string.isRequired,
  barColor: PropTypes.string.isRequired
}

export default PieChart
