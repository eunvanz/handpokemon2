import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { VERSION } from 'constants/release'

import { getMsg, isOlderVersion } from 'utils/commonUtil'

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
    const { messages, locale, releaseInfo } = this.props
    return (
      <div id='footer'>
        <p>made with &#9829; for Pokémon® by CIVASOUL</p>
        <small>v.{VERSION}{isOlderVersion(VERSION, releaseInfo.version) ? <span className='c-red'>{` ${getMsg(messages.common.isNotLatestVersion, locale)}`}</span> : ''}</small>
      </div>
    )
  }
}

Footer.contextTypes = {
  router: PropTypes.object.isRequired
}

Footer.propTypes = {
  releaseInfo: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default Footer
