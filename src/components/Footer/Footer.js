import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div id='footer'>
        Copyright © 2018 CIVASOUL
      </div>
    )
  }
}

Footer.contextTypes = {
  router: PropTypes.object.isRequired
}

Footer.propTypes = {
}

export default Footer
