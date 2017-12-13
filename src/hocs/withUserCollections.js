import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import { convertMapToArr } from 'utils/commonUtil'

import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withUserCollections extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { userCollections, mons, ...props } = this.props
      if (!mons) return <LoadingContainer text='콜렉션 정보를 가져오는 중...' />
      return (
        <ComposedComponent userCollections={userCollections} mons={mons} {...props} />
      )
    }
  }

  withUserCollections.propTypes = {
    userCollections: PropTypes.array,
    mons: PropTypes.array
  }

  const mapStateToProps = (state) => {
    const userCollections = dataToJS(state.firebase, 'userCollections')
    let key = null
    if (userCollections) key = Object.keys(userCollections)[0]
    return {
      mons: convertMapToArr(dataToJS(state.firebase, 'mons')),
      userCollections: key ? convertMapToArr(userCollections[key]) : null
    }
  }

  const wrappedwithUserCollections = firebaseConnect(({ auth }) => (auth ? [`/userCollections/${auth.uid}`] : null))(withUserCollections)

  return connect(mapStateToProps, null)(wrappedwithUserCollections)
}
