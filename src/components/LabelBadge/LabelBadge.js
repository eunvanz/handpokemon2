import React from 'react'
import PropTypes from 'prop-types'

import { levelBadgeStyle } from 'constants/styles'

class LabelBadge extends React.Component {
  render () {
    return (
      <div style={Object.assign({}, levelBadgeStyle, this.props.style)}>{this.props.text}</div>
    )
  }
}

LabelBadge.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object
}

export default LabelBadge
