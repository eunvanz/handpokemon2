import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import { convertMapToArr } from 'utils/commonUtil'

import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withMons extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { mons, ...props } = this.props
      if (!mons) return <LoadingContainer text='포켓몬 정보를 가져오는 중...' />
      return (
        <ComposedComponent mons={mons} {...props} />
      )
    }
  }

  withMons.propTypes = {
    mons: PropTypes.array
  }

  const mapStateToProps = (state) => {
    return {
      mons: convertMapToArr(dataToJS(state.firebase, 'mons'))
    }
  }

  const wrappedWithMons = firebaseConnect(['/mons'])(withMons)

  return connect(mapStateToProps, null)(wrappedWithMons)
}
