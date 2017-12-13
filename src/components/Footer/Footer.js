import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { VERSION } from 'constants/release'

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
        <p>made with &#9829; for Pokémon® by CIVASOUL</p>
        <small>v.{VERSION}</small>
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
