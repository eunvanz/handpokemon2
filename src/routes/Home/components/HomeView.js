import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { toast } from 'react-toastify'

import { getMsg } from 'utils/commonUtil'

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount () {
    const { auth, user } = this.props
    let isSocialAccount = false
    if (auth && auth.providerData[0].providerId !== 'password') isSocialAccount = true
    if (isSocialAccount) {
      if (!user.nickname) {
        // 소셜계정이지만 아직 회원가입을 안했을 때의 처리
        this.context.router.push('sign-up')
      }
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div>
        홈
      </div>
    )
  }
}

HomeView.contextTypes = {
  router: PropTypes.object.isRequired
}

HomeView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default HomeView

