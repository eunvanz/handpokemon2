import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import keygen from 'keygenerator'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'
import Img from 'components/Img'

import { getMonImage } from 'utils/monUtil'

import { colors } from 'constants/colors'

import { receivePickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = {
  receivePickMonInfo
}

const mapStateToProps = (state) => {
  return {}
}

class MonModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showStat: false
    }
    this._handleOnClickEvolution = this._handleOnClickEvolution.bind(this)
  }
  _handleOnClickEvolution () {
    const { mon, receivePickMonInfo, close } = this.props
    const pickMonInfo = {
      quantity: 1,
      evoluteCol: mon.tobe
    }
    receivePickMonInfo(pickMonInfo)
    close()
    this.context.router.push(`pick-mon?f=${keygen._()}`)
  }
  render () {
    const { mon, show, close, type, ...restProps } = this.props
    const tobeMon = mon.tobe
    const renderLevel = () => {
      if (mon.asis) {
        return (
          <div className='text-center m-b-30' style={{ height: '60px' }}>
            <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small'}} />
            {
              tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
              <div className='m-t-15'>
                <Button text='진화하기' color='deeporange' onClick={this._handleOnClickEvolution} />
              </div>
            }
          </div>
        )
      }
      return (
        <div>
          <MonLevel level={tobeMon.level} />
          {
            tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
            <div className='m-t-15'>
              <Button text='진화하기' color='deeporange' onClick={this._handleOnClickEvolution} />
            </div>
          }
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
          <Button link text='닫기' onClick={close} />
          <Button text='뒤집기' icon='fa fa-refresh'
            onClick={() => this.setState({ showStat: !this.state.showStat })} />
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
  receivePickMonInfo: PropTypes.func.isRequired,
  location: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(MonModal)
