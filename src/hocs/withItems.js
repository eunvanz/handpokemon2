import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { sortBy } from 'lodash'

import { convertMapToArr } from 'utils/commonUtil'

import LoadingContainer from 'components/LoadingContainer'

export default ComposedComponent => {
  class withItems extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { items, ...props } = this.props
      if (!items) return <LoadingContainer text='아이템 목록을 가져오는 중...' />
      return (
        <ComposedComponent items={items} {...props} />
      )
    }
  }

  withItems.propTypes = {
    items: PropTypes.array
  }

  const mapStateToProps = (state) => {
    return {
      items: sortBy(convertMapToArr(dataToJS(state.firebase, 'items')), ['seq'])
    }
  }

  const wrappedWithMons = firebaseConnect(['/items'])(withItems)

  return connect(mapStateToProps, null)(wrappedWithMons)
}
