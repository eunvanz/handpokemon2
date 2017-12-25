import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

import { attrs } from 'constants/data'
import { ATTR_MATCH, ATTR_IDX } from 'constants/rules'
import { colors } from 'constants/colors'

import CustomModal from '../CustomModal'
import Selectbox from '../Selectbox'
import Button from '../Button'

class AttrCalcModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      attackerMainAttr: '',
      attackerSubAttr: '',
      defenderMainAttr: '',
      defenderSubAttr: ''
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._calculate = this._calculate.bind(this)
    this._handleOnClickReverse = this._handleOnClickReverse.bind(this)
  }
  _handleOnChangeInput (e) {
    const { value, id } = e.target
    this.setState({ [id]: value })
  }
  _calculate () {
    const { attackerMainAttr, attackerSubAttr, defenderMainAttr, defenderSubAttr } = this.state
    if (attackerMainAttr === '' || defenderMainAttr === '') {
      return null
    }
    const attackerMainAttrIdx = ATTR_IDX.indexOf(attackerMainAttr)
    const attackerSubAttrIdx = ATTR_IDX.indexOf(attackerSubAttr)
    const defenderMainAttrIdx = ATTR_IDX.indexOf(defenderMainAttr)
    const defenderSubAttrIdx = ATTR_IDX.indexOf(defenderSubAttr)
    let result = 1
    result = ATTR_MATCH[attackerMainAttrIdx][defenderMainAttrIdx]
    if (defenderSubAttrIdx !== -1) result = result * ATTR_MATCH[attackerMainAttrIdx][defenderSubAttrIdx]
    if (attackerSubAttrIdx !== -1) {
      result = result * ATTR_MATCH[attackerSubAttrIdx][attackerMainAttrIdx]
      if (defenderSubAttrIdx !== -1) result = result * ATTR_MATCH[attackerSubAttrIdx][defenderSubAttrIdx]
    }
    result *= 100
    if (result > 100) {
      return `데미지 보너스 +${numeral(result - 100).format('0')}%`
    } else if (result === 100) {
      return '보너스 없음'
    } else {
      return `데미지 패널티 -${numeral(100 - result).format('0')}%`
    }
  }
  _handleOnClickReverse () {
    const { attackerMainAttr, attackerSubAttr, defenderMainAttr, defenderSubAttr } = this.state
    this.setState({
      attackerMainAttr: defenderMainAttr,
      attackerSubAttr: defenderSubAttr,
      defenderMainAttr: attackerMainAttr,
      defenderSubAttr: attackerSubAttr
    })
  }
  render () {
    const { show, close } = this.props
    const { attackerMainAttr, attackerSubAttr, defenderMainAttr, defenderSubAttr } = this.state
    const renderBody = () => {
      return (
        <div>
          <div className='row'>
            <div className='col-xs-12 f-700'>공격 포켓몬</div>
            <div className='col-xs-6'>
              <Selectbox
                id='attackerMainAttr'
                defaultValue='주속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={attackerMainAttr}
              />
            </div>
            <div className='col-xs-6'>
              <Selectbox
                id='attackerSubAttr'
                defaultValue='보조속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={attackerSubAttr}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 f-700'>수비 포켓몬</div>
            <div className='col-xs-6'>
              <Selectbox
                id='defenderMainAttr'
                defaultValue='주속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={defenderMainAttr}
              />
            </div>
            <div className='col-xs-6'>
              <Selectbox
                id='defenderSubAttr'
                defaultValue='보조속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={defenderSubAttr}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 f-700 text-center' style={{ fontSize: '20px', color: this._calculate() && this._calculate().indexOf('-') > -1 ? colors.red : colors.lightBlue }}>
              {this._calculate() || '속성을 선택해주세요.'}
            </div>
          </div>
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button link text='닫기' onClick={close} />
          <Button disable={!this._calculate()} icon='fa fa-sync' onClick={this._handleOnClickReverse} text='역계산' />
        </div>
      )
    }
    return (
      <CustomModal
        show={show}
        close={close}
        title='상성계산기'
        backdrop
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        id='attrCarcModal'
      />
    )
  }
}

AttrCalcModal.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func.isRequired
}

export default AttrCalcModal
