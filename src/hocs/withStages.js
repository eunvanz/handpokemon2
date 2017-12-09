import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { orderBy } from 'lodash'

import { convertMapToArr } from 'utils/commonUtil'

import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withStages extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { stages, ...props } = this.props
      if (!stages) return <LoadingContainer text='스테이지 정보를 가져오는 중...' />
      return (
        <ComposedComponent stages={stages} {...props} />
      )
    }
  }

  withStages.propTypes = {
    stages: PropTypes.array
  }

  const mapStateToProps = (state) => {
    return {
      stages: orderBy(convertMapToArr(dataToJS(state.firebase, 'stages')), ['no'], ['desc'])
    }
  }

  const wrappedWithMons = firebaseConnect(['/stages'])(withStages)

  return connect(mapStateToProps, null)(wrappedWithMons)
}
