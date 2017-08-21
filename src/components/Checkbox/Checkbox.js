import React from 'react'
import PropTypes from 'prop-types'

class Checkbox extends React.Component {
  render () {
    return (
      <label className='checkbox checkbox-inline m-r-20' style={{ lineHeight: '1' }}>
        <input type='checkbox' onChange={this.props.onChange} name={this.props.name} checked={this.props.checked} />
        <i className='input-helper' style={{ top: '3px' }} /> {this.props.label}
      </label>
    )
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default Checkbox
