import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { orderBy } from 'lodash'

import { convertMapToArr } from 'utils/commonUtil'

import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withBoards extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { boards, ...props } = this.props
      if (!boards || boards.length === 0) return <LoadingContainer text='게시판 정보를 가져오는 중...' />
      return (
        <ComposedComponent boards={boards} {...props} />
      )
    }
  }

  withBoards.propTypes = {
    boards: PropTypes.object
  }

  const mapStateToProps = (state) => {
    return {
      boards: {
        notice: orderBy(convertMapToArr(dataToJS(state.firebase, 'boards/notice')), ['regDate'], ['desc']),
        free: orderBy(convertMapToArr(dataToJS(state.firebase, 'boards/free')), ['regDate'], ['desc']),
        guide: orderBy(convertMapToArr(dataToJS(state.firebase, 'boards/guide')), ['regDate'], ['desc'])
      }
    }
  }

  const wrappedWithBoards = firebaseConnect(['/boards'])(withBoards)

  return connect(mapStateToProps, null)(wrappedWithBoards)
}
