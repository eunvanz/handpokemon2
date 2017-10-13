import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { gradesColors, attrColors, colors } from 'constants/colors'
import { badgeStyle } from 'constants/styles'

import { isScreenSize } from 'utils/commonUtil'

class MonAttr extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { grade, mainAttr, subAttr, point, isDummy, ...restProps } = this.props
    const getGradeColor = grade => {
      if (isDummy) {
        return { backgroundColor: colors.lightGray, color: colors.lightGray }
      } else if (grade === 'b') {
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
      if (isDummy) {
        return 'DUMMY'
      } else if (grade === 'b') {
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
      if (isDummy) return { backgroundColor: colors.lightGray, color: colors.lightGray }
      return { backgroundColor: attrColors[attr].bg, color: attrColors[attr].text }
    }
    return (
      <div {...restProps}>
        {
          (grade || isDummy) &&
          <i style={Object.assign({}, badgeStyle, getGradeColor(grade))}>{getGradeName(grade)}</i>
        }
        {
          point &&
          <span>(<span className='c-blue f-700'>+{point}</span> 콜렉션점수)</span>
        }
        {
          (mainAttr || isDummy) &&
          <i style={Object.assign({}, badgeStyle, getAttrColor(mainAttr))}>{isDummy ? 'DM' : mainAttr}</i>
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
  point: PropTypes.number,
  isDummy: PropTypes.bool
}

export default MonAttr
