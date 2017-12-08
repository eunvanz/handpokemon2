import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withCreditInfo extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { creditInfo, ...props } = this.props
      if (!creditInfo) return <LoadingContainer text='크레딧 정보를 가져오는 중...' />
      return (
        <ComposedComponent creditInfo={creditInfo} {...props} />
      )
    }
  }

  withCreditInfo.propTypes = {
    creditInfo: PropTypes.object
  }

  const mapStateToProps = (state) => {
    return {
      creditInfo: state.creditInfo
    }
  }

  const wrappedCreditInfo = connect(mapStateToProps, null)(withCreditInfo)

  return connect(mapStateToProps, null)(wrappedCreditInfo)
}
