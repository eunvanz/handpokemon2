import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import Waypoint from 'react-waypoint'

import Loading from 'components/Loading'

class WaypointListContainer extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { elements, onLoad, isLastPage, isLoading, loadingText } = this.props
    return (
      <div>
        {elements}
        {isLoading && <Loading text={loadingText} />}
        {!isLastPage && <div className='col-xs-12'><Waypoint onEnter={onLoad} /></div>}
      </div>
    )
  }
}

WaypointListContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

WaypointListContainer.propTypes = {
  elements: PropTypes.array.isRequired,
  onLoad: PropTypes.func.isRequired,
  isLastPage: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string
}

export default WaypointListContainer
