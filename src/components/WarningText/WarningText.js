import React from 'react'
import PropTypes from 'prop-types'

class WarningText extends React.Component {
  render () {
    return (
      <div><i className='fa fa-exclamation-circle' /> {this.props.text}</div>
    )
  }
}

WarningText.propTypes = {
  text: PropTypes.string.isRequired
}

export default WarningText
