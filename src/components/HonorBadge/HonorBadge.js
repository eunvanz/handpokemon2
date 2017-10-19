import React from 'react'
import PropTypes from 'prop-types'

import { badgeStyle } from 'constants/styles'
import { attrColors, gradesColors } from 'constants/colors'

class HonorBadge extends React.Component {
  render () {
    const { honor, ...restProps } = this.props
    const getAttrColor = attr => {
      return { backgroundColor: attrColors[attr].bg, color: attrColors[attr].text }
    }
    const getTrainerGradeColor = grade => {
      let mappedGrade
      if (grade.endsWith('트레이너')) mappedGrade = 'basic'
      if (grade.endsWith('레인저')) mappedGrade = 'rare'
      if (grade.endsWith('짐리더')) mappedGrade = 'special'
      if (grade.endsWith('챔피언')) mappedGrade = 'sRare'
      if (grade.endsWith('마스터')) mappedGrade = 'elite'
      return { backgroundColor: gradesColors[mappedGrade].bg, color: gradesColors[mappedGrade].text }
    }
    return (
      <i style={Object.assign({}, badgeStyle, honor.type === 1 ? getTrainerGradeColor(honor.name) : getAttrColor(honor.attr))} {...restProps}>{honor.name}</i>
    )
  }
}

HonorBadge.propTypes = {
  honor: PropTypes.object.isRequired
}

export default HonorBadge
