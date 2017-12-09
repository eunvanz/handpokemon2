import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

export default isAuthRequired => ComposedComponent => {
  class withAuth extends React.Component {
    componentDidMount () {
      if (isAuthRequired) {
        const { user } = this.props
        if (!user || !user.nickname) this.context.router.push('/sign-in')
      }
    }
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { user, auth, ...props } = this.props
      if (isAuthRequired && (!user || !user.nickname)) return <div /> // !user.nickname 조건은 user가 비어있는 객체 {}로 올 수 있기 때문
      return (
        <ComposedComponent user={user && user.nickname ? user : null} auth={user && user.nickname ? auth : null} {...props} />
      )
    }
  }

  withAuth.contextTypes = {
    router: PropTypes.object.isRequired
  }

  withAuth.propTypes = {
    auth: PropTypes.object,
    user: PropTypes.object
  }

  const mapStateToProps = (state) => {
    return {
      ...getAuthUserFromFirebase(state)
    }
  }

  const wrappedWithAuth = firebaseConnect()(withAuth)

  return connect(mapStateToProps, null)(wrappedWithAuth)
}
