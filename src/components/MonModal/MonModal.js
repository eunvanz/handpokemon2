import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import keygen from 'keygenerator'
import shallowCompare from 'react-addons-shallow-compare'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'
import Img from 'components/Img'

import { getMonImage } from 'utils/monUtil'
import { showAlert } from 'utils/commonUtil'

import { colors } from 'constants/colors'

import { updatePickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = dispatch => {
  return {
    // updatePickMonInfo: pickMonInfo => dispatch(receivePickMonInfo(pickMonInfo))
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo))
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
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickEvolution () {
    const { mon, updatePickMonInfo, close } = this.props
    const colToEvolute = mon.tobe
    if (colToEvolute.isDefender && colToEvolute.level === colToEvolute.mon[colToEvolute.monId].evoLv) {
      showAlert({ title: '이런!', text: '진화가능 레벨의 수비 포켓몬은 진화할 수 없습니다. 한번 더 레벨업 해주세요.', type: 'error' })
      return false
    } else if (colToEvolute.isFavorite && colToEvolute.level === colToEvolute.mon[colToEvolute.monId].evoLv) {
      showAlert({ title: '이런!', text: '진화가능 레벨의 즐겨찾기 포켓몬은 진화할 수 없습니다. 한번 더 레벨업 해주세요.', type: 'error' })
      return false
    }
    const pickMonInfo = {
      quantity: 1,
      evoluteCol: colToEvolute
    }
    updatePickMonInfo(pickMonInfo)
    .then(() => {
      close()
      this.context.router.push(`/pick-mon?f=${keygen._()}`)
    })
  }
  _handleOnClickMix () {
    const { mon, updatePickMonInfo, close } = this.props
    const colToMix = mon.tobe
    if (colToMix.isDefender && colToMix.level === 1) {
      showAlert({ title: '이런!', text: 'LV.1의 수비 포켓몬은 교배할 수 없습니다.', type: 'error' })
      return false
    } else if (colToMix.isFavorite && colToMix.level === 1) {
      showAlert({ title: '이런!', text: 'LV.1의 즐겨찾기 포켓몬은 교배할 수 없습니다.', type: 'error' })
      return false
    }
    const pickMonInfo = {
      quantity: 1,
      mixCols: [colToMix]
    }
    updatePickMonInfo(pickMonInfo)
    .then(() => {
      close()
      this.context.router.push(`/collection/${mon.tobe.userId}`)
    })
  }
  render () {
    const { mon, show, close, type, updatePickMonInfo, pickMonInfo, isNotMine, user, locale, ...restProps } = this.props
    const tobeMon = mon.tobe
    const renderLevel = () => {
      if (mon.asis) {
        return (
          <div className='text-center m-b-30' style={{ height: '60px' }}>
            <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small' }} />
            {
            !isNotMine &&
            <div className='m-t-15'>
              {
                tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
                <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
              }
              <Button text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
            </div>
            }
          </div>
        )
      }
      return (
        <div>
          <MonLevel level={tobeMon.level} />
          {
            !isNotMine && type !== 'defender' &&
            <div className='m-t-15'>
              {
                tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
                <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
              }
              <Button text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
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
              <Img src={type === 'collection' || type === 'defender' ? getMonImage(tobeMon).url : 'hidden'} width='100%'
                style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} cache />
            </p>
            {tobeMon.level &&
              renderLevel()
            }
          </div>
          <MonInfo monObj={mon} showStat={this.state.showStat} type={type} forModal user={user} locale={locale} />
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button text='뒤집기' icon='fa fa-sync'
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
  pickMonInfo: PropTypes.object,
  isNotMine: PropTypes.bool,
  user: PropTypes.object,
  locale: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(MonModal)
