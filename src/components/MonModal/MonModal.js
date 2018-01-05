import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import keygen from 'keygenerator'
import shallowCompare from 'react-addons-shallow-compare'
import { browserHistory, Link } from 'react-router'
import $ from 'jquery'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'
import Img from 'components/Img'
import Info from 'components/Info'
import Selectbox from 'components/Selectbox'

import { getMonImage } from 'utils/monUtil'
import { showAlert } from 'utils/commonUtil'

import { colors } from 'constants/colors'

import { updatePickMonInfo } from 'store/pickMonInfo'

import { updateCollectionPath, updateCollection } from 'services/CollectionService'

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
      showStat: false,
      imageSeq: props.mon.tobe.imageSeq,
      mon: props.mon
    }
    this._handleOnClickEvolution = this._handleOnClickEvolution.bind(this)
    this._handleOnClickMix = this._handleOnClickMix.bind(this)
    this._handleOnChangeImage = this._handleOnChangeImage.bind(this)
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
      browserHistory.replace(`/pick-mon?f=${keygen._()}`)
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
      this.context.router.replace(`/collection/${mon.tobe.userId}`)
    })
  }
  _handleOnChangeImage (e) {
    const { value } = e.target
    const { firebase, mon } = this.props
    if (value === '') return
    this.setState({ imageSeq: Number(value) })
    updateCollectionPath(firebase, mon.tobe, 'imageSeq', Number(value))
    const url = mon.tobe.mon[mon.tobe.monId].monImage.filter(image => image.seq === Number(value))[0].url
    $(`img#${mon.tobe.id}`).attr('src', url)
    if (mon.tobe.mon[mon.tobe.monId].name.ko === '킬가르도') {
      const newCol = Object.assign({}, mon.tobe)
      const power = mon.tobe.mon[mon.tobe.monId].power
      const colPower = mon.tobe.power
      const armor = mon.tobe.mon[mon.tobe.monId].armor
      const colArmor = mon.tobe.armor
      const sPower = mon.tobe.mon[mon.tobe.monId].sPower
      const colSPower = mon.tobe.sPower
      const sArmor = mon.tobe.mon[mon.tobe.monId].sArmor
      const colSArmor = mon.tobe.sArmor
      if (value === '1') {
        newCol.mon[newCol.monId].power = power > armor ? power : armor
        newCol.power = colPower > colArmor ? colPower : colArmor
        newCol.mon[newCol.monId].armor = power > armor ? armor : power
        newCol.armor = colPower > colArmor ? colArmor : colPower
        newCol.mon[newCol.monId].sPower = sPower > sArmor ? sPower : sArmor
        newCol.sPower = colSPower > colSArmor ? colSPower : colSArmor
        newCol.mon[newCol.monId].sArmor = sPower > sArmor ? sArmor : sPower
        newCol.sArmor = colSPower > colSArmor ? colSArmor : colSPower
      } else if (value === '0') {
        newCol.mon[newCol.monId].power = power < armor ? power : armor
        newCol.power = colPower < colArmor ? colPower : colArmor
        newCol.mon[newCol.monId].armor = power < armor ? armor : power
        newCol.armor = colPower < colArmor ? colArmor : colPower
        newCol.mon[newCol.monId].sPower = sPower < sArmor ? sPower : sArmor
        newCol.sPower = colSPower < colSArmor ? colSPower : colSArmor
        newCol.mon[newCol.monId].sArmor = sPower < sArmor ? sArmor : sPower
        newCol.sArmor = colSPower < colSArmor ? colSArmor : colSPower
      }
      updateCollection(firebase, newCol)
      this.setState({ mon: Object.assign({}, mon, { tobe: newCol }) })
    }
  }
  render () {
    const { mon, show, close, type, updatePickMonInfo, pickMonInfo, isNotMine, user, locale, blinkMix, isMaxLevel, firebase, ...restProps } = this.props
    const { imageSeq } = this.state
    const tobeMon = mon.tobe
    const renderLevel = () => {
      if (mon.asis) {
        return (
          <div className='text-center m-b-30' style={{ height: '60px' }}>
            <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small' }} isMaxLevel={isMaxLevel} />
            {
            !isNotMine &&
            <div className='m-t-15'>
              {
                tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
                <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
              }
              <Button className={blinkMix ? 'blink-opacity' : null} text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
            </div>
            }
          </div>
        )
      }
      return (
        <div>
          <MonLevel level={tobeMon.level} isMaxLevel={isMaxLevel} /> {isMaxLevel && <Info id='maxLevelInfo' title='최대레벨' content={<div>현재 포켓몬이 최대레벨에 도달했습니다. 콜렉션 점수가 높으면 높을수록 최대레벨 한도도 올라갑니다. 자세한 사항은 <Link to='/board-list/guide/-L1Nv0pE3BopkKsqQDRH'>이곳</Link>을 참조해주세요.</div>} />}
          {
            !isNotMine && type !== 'defender' &&
            <div className='m-t-15'>
              {
                tobeMon.mon[tobeMon.monId].evoLv !== 0 && tobeMon.level >= tobeMon.mon[tobeMon.monId].evoLv &&
                <Button text='진화하기' color='deeporange' size='xs' className='m-r-5' onClick={this._handleOnClickEvolution} />
              }
              <Button className={blinkMix ? 'blink-opacity' : null} text='교배하기' color='orange' size='xs' onClick={this._handleOnClickMix} />
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
              <Img src={type === 'collection' || type === 'defender' ? getMonImage(tobeMon, imageSeq).url : 'hidden'} width='100%'
                style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} cache />
            </p>
            {
              !isNotMine && tobeMon.mon && tobeMon.mon[tobeMon.monId].monImage.length > 1 &&
              <div className='row'>
                <div className='col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-12'>
                  <Selectbox
                    id='monImage'
                    defaultValue='일러스트선택'
                    options={tobeMon.mon[tobeMon.monId].monImage.map(item => {
                      return { name: `${item.designer}`, value: item.seq }
                    })}
                    onChange={this._handleOnChangeImage}
                    value={this.state.imageSeq}
                  />
                </div>
              </div>
            }
            {tobeMon.level &&
              renderLevel()
            }
          </div>
          <MonInfo monObj={this.state.mon} showStat={this.state.showStat} type={type} forModal user={user} locale={locale} />
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
  locale: PropTypes.string,
  blinkMix: PropTypes.bool,
  isMaxLevel: PropTypes.bool,
  firebase: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(MonModal)
