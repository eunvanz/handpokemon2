import React from 'react'
import PropTypes from 'prop-types'
import keygen from 'keygenerator'

import ProgressBar from 'components/ProgressBar'
import Info from 'components/Info'

import { colors } from 'constants/colors'

class Stat extends React.Component {
  render () {
    const { value, label, addedValue1, addedValue2, preValue } = this.props
    const renderStatStack = () => {
      return [value, preValue, addedValue1, addedValue2].map((val, idx) => {
        if (val === 0) return null
        let textColor = 'c-gray'
        if (idx === 1) textColor = 'c-green'
        else if (idx === 2) textColor = 'c-orange'
        else if (idx === 3) textColor = 'c-lightblue'
        return <span key={idx} className={textColor}>{`${idx > 0 ? ' +' : ''}${val}`}</span>
      })
    }
    const renderInfo = () => {
      let content
      if (label === '체력' || label === '평균 체력') {
        content = '포켓몬의 HP를 결정짓는 능력치입니다.'
      } else if (label === '공격' || label === '평균 공격') {
        content = '포켓몬의 일반공격 데미지를 결정짓는 능력치입니다.'
      } else if (label === '방어' || label === '평균 방어') {
        content = '일반공격 피격시 데미지를 줄여주는 능력치입니다. 이 수치가 높을 수록 일반공격에 대한 완벽방어의 확률도 높아집니다.'
      } else if (label === '특수공격' || label === '평균 특수공격') {
        content = '포켓몬의 특수공격 데미지를 결정짓는 능력치입니다. 특수공격은 일반공격보다 데미지가 큽니다.'
      } else if (label === '특수방어' || label === '평균 특수방어') {
        content = '특수공격 피격시 데미지를 줄여주는 능력치입니다. 이 수치가 높을 수록 특수공격에 대한 완벽방어의 확률도 높아집니다.'
      } else if (label === '민첩' || label === '평균 민첩') {
        content = '피격시 회피확률을 결정짓습니다. 또한 공격력과 방어력에도 미세하게 영향을 미칩니다.'
      }
      return (
        <Info id={keygen._()} title={label} content={content} />
      )
    }
    return (
      <div className='row' style={{ marginBottom: '10px' }}>
        <p className='col-xs-12 f-700' style={{ marginBottom: '0px' }}>{label} : {renderStatStack()} {renderInfo()}</p>
        <div className='col-xs-10' style={{ paddingTop: '9px' }}>
          <ProgressBar max={300} value={[preValue, value, addedValue1, addedValue2]} color={[colors.green, colors.amber, colors.orange, colors.lightBlue]} />
        </div>
        <div className='col-xs-2 f-700'><span className='c-blue'>{preValue + value + addedValue1 + addedValue2}</span></div>
      </div>
    )
  }
}

Stat.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  addedValue1: PropTypes.number,
  addedValue2: PropTypes.number,
  preValue: PropTypes.number
}

export default Stat
