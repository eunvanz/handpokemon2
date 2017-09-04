import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import keygen from 'keygenerator'
import { fromJS, is } from 'immutable'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'
import Img from 'components/Img'

import { getMonImage } from 'utils/monUtil'

import { colors } from 'constants/colors'

import { receivePickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(receivePickMonInfo(pickMonInfo))
  }
}

const mapStateToProps = (state) => {
  return {
    pickMonInfo: state.pickMonInfo
  }
}

class MonModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showStat: false
    }
    this._handleOnClickEvolution = this._handleOnClickEvolution.bind(this)
    this._handleOnClickMix = this._handleOnClickMix.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  _handleOnClickEvolution () {
    const { mon, updatePickMonInfo, close } = this.props
    const pickMonInfo = {
      quantity: 1,
      evoluteCol: mon.tobe
    }
    updatePickMonInfo(pickMonInfo)
    close()
    setTimeout(() => {
      this.context.router.push(`/pick-mon?f=${keygen._()}`)
    }, 200)
  }
  _handleOnClickMix () {
    const { mon, updatePickMonInfo, close } = this.props
    const pickMonInfo = {
      quantity: 1,
      mixCols: [mon.tobe]
    }
    updatePickMonInfo(pickMonInfo)
    close()
    setTimeout(() => {
      this.context.router.push(`/collection/${mon.tobe.userId}`)
    }, 200)
  }
  render () {
    const { mon, show, close, type, updatePickMonInfo, ...restProps } = this.props
    const tobeMon = mon.tobe
    const renderLevel = () => {
      if (mon.asis) {
        return (
          <div className='text-center m-b-30' style={{ height: '60px' }}>
            <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small' }} />
            <div className='m-t-15'>
              {
                tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
                <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
              }
              <Button text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
            </div>
          </div>
        )
      }
      return (
        <div>
          <MonLevel level={tobeMon.level} />
          <div className='m-t-15'>
            {
              tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
              <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
            }
            <Button text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
          </div>
        </div>
      )
    }
    const renderBody = () => {
      return (
        <div className='row'>
          <div className='col-sm-4 col-xs-12 text-center' style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px' }}>
              <Img src={type === 'collection' ? getMonImage(tobeMon).url : 'hidden'} width='100%'
                style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} />
            </p>
            {tobeMon.level &&
              renderLevel()
            }
          </div>
          <MonInfo monObj={mon} showStat={this.state.showStat} type={type} forModal />
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button text='뒤집기' icon='fa fa-refresh'
            onClick={() => this.setState({ showStat: !this.state.showStat })} />
          <Button link text='닫기' onClick={close} />
        </div>
      )
    }
    return (
      <CustomModal
        title='포켓몬 정보'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        show={show}
        close={close}
        backdrop
        {...restProps}
      />
    )
  }
}

MonModal.contextTypes = {
  router: PropTypes.object.isRequired
}

MonModal.propTypes = {
  mon: PropTypes.object, // asis, tobe
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  type: PropTypes.string,
  location: PropTypes.object,
  updatePickMonInfo: PropTypes.func.isRequired,
  pickMonInfo: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(MonModal)
