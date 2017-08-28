import React from 'react'
import PropTypes from 'prop-types'
import keygen from 'keygenerator'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Button from 'components/Button'
import MonInfo from 'components/MonInfo'
import MonLevel from 'components/MonLevel'
import LabelBadge from 'components/LabelBadge'

import { colors } from 'constants/colors'

import { receivePickMonInfo } from 'store/pickMonInfo'

import bg from './assets/unloader.png'

const mapDispatchToProps = {
  receivePickMonInfo
}

const mapStateToProps = (state) => {
  return {}
}

class Roulette extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stop: false,
      isStopped: false // 완전히 멈춘 상태
    }
    this._startRoulette = this._startRoulette.bind(this)
    this._handleOnClickStop = this._handleOnClickStop.bind(this)
    this._handleOnClickContinue = this._handleOnClickContinue.bind(this)
    this._handleOnClickEvolution = this._handleOnClickEvolution.bind(this)
  }
  componentDidMount () {
    this._startRoulette()
  }
  shouldComponentUpdate (nextProps, nextState) {
    const $ = window.$
    if (!this.state.stop && nextState.stop) {
      $(`#${this.props.id}`).roulette('stop')
      $('#stopBtn').attr('disabled', 'true')
    }
    if (!this.state.isStopped && nextState.isStopped) {
      $('#stopBtn').css('display', 'none')
      $('#monInfo').css('display', 'block')
      $('#btnArea').css('display', 'block')
    }
    if (this.props.btnComponent !== nextProps.btnComponent) {
      ReactDOM.render(nextProps.btnComponent, document.getElementById('btnArea'))
    }
    return false
  }
  componentDidUpdate (prevProps, prevState) {
    this._startRoulette()
  }
  _handleOnClickEvolution (mon) {
    const { receivePickMonInfo } = this.props
    const pickMonInfo = {
      quantity: 1,
      evoluteCol: mon
    }
    receivePickMonInfo(pickMonInfo)
    close()
    this.context.router.push(`pick-mon?f=${keygen._()}`)
  }
  _startRoulette () {
    const $ = window.$
    if ($(`#${this.props.id} img`).length < this.props.images.length) {
      setTimeout(() => this._startRoulette(), 500)
    } else {
      const option = {
        speed: 8,
        duration: 10,
        stopImageNumber: this.props.stopIdx,
        stopCallback: () => {
          this.setState({ isStopped: true, stop: true })
        }
      }
      $(`#${this.props.id}`).roulette(option).delay(this.props.delay || 0).roulette('start')
    }
  }
  _handleOnClickStop () {
    if (!this.state.stop) this.setState({ stop: true })
  }
  _handleOnClickContinue () {
    this.context.router.push(`pick-mon?f=${keygen._()}`)
  }
  render () {
    const { images, size, id, style, innerSize, mon, btnComponent } = this.props
    const renderImages = () => {
      return images.map(image => <img src={image} key={keygen._()} style={{ width: `${innerSize || size}px`, height: `${innerSize || size}px` }} />)
    }
    const renderLevelUpInfo = () => {
      if (mon.asis) {
        // 레벨 업 시
        return <div className='text-center m-b-20'>
          <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'medium'}} />
          {mon.tobe.mon[mon.tobe.monId].evoLv !== 0 && mon.tobe.level >= mon.tobe.mon[mon.tobe.monId].evoLv &&
            <div className='m-t-15'>
              <Button text='진화하기' color='deeporange' onClick={() => this._handleOnClickEvolution(mon.tobe)} />
            </div>
          }
        </div>
      } else {
        // 새로운 포켓몬
        return <div className='text-center m-b-30'>
          <LabelBadge text='새로운 포켓몬' style={{ fontSize: 'medium', backgroundColor: colors.red }} />
          <p className='m-t-5'>콜렉션점수 <span className='c-lightblue f-700'>+{mon.tobe.mon[mon.tobe.monId].point}</span></p>
        </div>
      }
    }
    return (
      <div className='m-t-20'>
        <div style={Object.assign({}, { width: `${size}px`, height: `${size}px`, border: `3px solid ${colors.lightGray}`, backgroundImage: `url(${bg})`  }, style)}>
          <div id={id} style={{ display: 'none', height: `${innerSize || size}px`, margin: `${innerSize ? (size - 6 - innerSize) / 2 : 0}px` }}>
            {renderImages()}
          </div>
        </div>
        <div className='m-t-20' />
        <Button text='STOP' onClick={this._handleOnClickStop}
          id='stopBtn'
        />
        <div id='monInfo' style={{ display: 'none' }}>
          {renderLevelUpInfo()}
          <div className='row'>
            <MonInfo monObj={mon} type='collection' showStat={mon.asis !== null} />
          </div>
        </div>
        <div className='text-center' id='btnArea' style={{ display: 'none', marginTop: '40px' }}>
          {btnComponent}
        </div>
      </div>
    )
  }
}

Roulette.contextTypes = {
  router: PropTypes.object.isRequired
}

Roulette.propTypes = {
  images: PropTypes.array.isRequired,
  stopIdx: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  delay: PropTypes.number,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  innerSize: PropTypes.number,
  mon: PropTypes.object,
  btnComponent: PropTypes.element,
  receivePickMonInfo: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Roulette)
