import React from 'react'
import PropTypes from 'prop-types'

import { isMobile } from 'utils/commonUtil'

class FloatingButton extends React.Component {
  render () {
    return (
      <button className='btn btn-float btn-danger m-btn waves-effect waves-circle waves-float'
        style={{ right: isMobile.any() ? '10px' : '40px', bottom: isMobile.any() ? '10px' : '40px' }}
        onClick={this.props.onClick}>
        <i className={this.props.iconClassName} />
      </button>
    )
  }
}

FloatingButton.contextTypes = {
  router: PropTypes.object.isRequired
}

FloatingButton.propTypes = {
  iconClassName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default FloatingButton
