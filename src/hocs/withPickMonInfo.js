import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'

import { updatePickMonInfo } from 'store/pickMonInfo'

export default ComposedComponent => {
  class withPickMonInfo extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { pickMonInfo, ...props } = this.props
      return (
        <ComposedComponent pickMonInfo={pickMonInfo} {...props} />
      )
    }
  }

  withPickMonInfo.propTypes = {
    pickMonInfo: PropTypes.object
  }

  const mapDispatchToProps = dispatch => {
    return {
      updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo))
    }
  }

  const mapStateToProps = (state) => {
    return {
      pickMonInfo: state.pickMonInfo
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(withPickMonInfo)
}
