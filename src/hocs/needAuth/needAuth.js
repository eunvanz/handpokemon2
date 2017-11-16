import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

export default ComposedComponent => {
  class needAuth extends React.Component {
    componentDidMount () {
      const { user } = this.props
      if (!user) this.context.router.push('/sign-in')
    }
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { user, ...props } = this.props
      if (!user) return null
      return (
        <ComposedComponent user={user} {...props} />
      )
    }
  }

  needAuth.contextTypes = {
    router: PropTypes.object.isRequired
  }

  needAuth.propTypes = {
    auth: PropTypes.object,
    user: PropTypes.object
  }

  const mapStateToProps = (state) => {
    return {
      ...getAuthUserFromFirebase(state)
    }
  }

  const wrappedNeedAuth = firebaseConnect([])(needAuth)

  return connect(mapStateToProps, null)(wrappedNeedAuth)
}
