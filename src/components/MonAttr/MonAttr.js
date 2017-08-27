import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import { gradesColors, attrColors } from 'constants/colors'
import { badgeStyle } from 'constants/styles'

import { isScreenSize } from 'utils/commonUtil'

class MonAttr extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  render () {
    const { grade, mainAttr, subAttr, point, ...restProps } = this.props
    const getGradeColor = grade => {
      if (grade === 'b') {
        return { backgroundColor: gradesColors.basic.bg, color: gradesColors.basic.text }
      } else if (grade === 's') {
        return { backgroundColor: gradesColors.special.bg, color: gradesColors.special.text }
      } else if (grade === 'r') {
        return { backgroundColor: gradesColors.rare.bg, color: gradesColors.rare.text }
      } else if (grade === 'sr') {
        return { backgroundColor: gradesColors.sRare.bg, color: gradesColors.sRare.text }
      } else if (grade === 'e') {
        return { backgroundColor: gradesColors.elite.bg, color: gradesColors.elite.text }
      } else {
        return { backgroundColor: gradesColors.legend.bg, color: gradesColors.legend.text }
      }
    }
    const getGradeName = grade => {
      if (grade === 'b') {
        return 'BASIC'
      } else if (grade === 's') {
        return isScreenSize.smallerThan(380) ? 'SPEC' : 'SPECIAL'
      } else if (grade === 'r') {
        return 'RARE'
      } else if (grade === 'sr') {
        return 'S.RARE'
      } else if (grade === 'e') {
        return 'ELITE'
      } else {
        return 'LEGEND'
      }
    }
    const getAttrColor = attr => {
      return { backgroundColor: attrColors[attr].bg, color: attrColors[attr].text }
    }
    return (
      <div {...restProps}>
        {
          grade &&
          <i style={Object.assign({}, badgeStyle, getGradeColor(grade))}>{getGradeName(grade)}</i>
        }
        {
          point &&
          <span>(<span className='c-blue f-700'>+{point}</span> 콜렉션점수)</span>
        }
        {
          mainAttr &&
          <i style={Object.assign({}, badgeStyle, getAttrColor(mainAttr))}>{mainAttr}</i>
        }
        {
          subAttr &&
          <i style={Object.assign({}, badgeStyle, getAttrColor(subAttr))}>{subAttr}</i>
        }
      </div>
    )
  }
}

MonAttr.propTypes = {
  grade: PropTypes.string,
  mainAttr: PropTypes.string,
  subAttr: PropTypes.string,
  point: PropTypes.number
}

export default MonAttr
