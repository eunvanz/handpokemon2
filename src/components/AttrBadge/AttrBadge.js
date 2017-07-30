import React from 'react'
import PropTypes from 'prop-types'

import { badgeStyle } from 'constants/styles'
import { attrColors } from 'constants/colors'

class AttrBadge extends React.Component {
  render () {
    const { attr, ...restProps } = this.props
    const getAttrColor = attr => {
      return { backgroundColor: attrColors[attr].bg, color: attrColors[attr].text }
    }
    return (
      <i style={Object.assign({}, badgeStyle, getAttrColor(attr))} {...restProps}>{attr}</i>
    )
  }
}

AttrBadge.contextTypes = {
  router: PropTypes.object.isRequired
}

AttrBadge.propTypes = {
  attr: PropTypes.string.isRequired
}

export default AttrBadge
