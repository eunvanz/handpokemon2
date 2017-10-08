import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import Infinite from 'react-infinite'

import Loading from 'components/Loading'

// ContentContainer 의 body에 들어가야 함
class ListContainer extends React.Component {
  shouldUpdateComponent (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { header, elements, onLoad, isLoading, isLastPage } = this.props
    const renderElements = () => {
      return (
        <Infinite
          elementHeight={70}
          useWindowAsScrollContainer
          infiniteLoadBeginEdgeOffset={isLastPage ? undefined : 200}
          onInfiniteLoad={onLoad}
          loadingSpinnerDelegate={<Loading height={70} />}
          isInfiniteLoading={isLoading}
        >
          {elements}
        </Infinite>
      )
    }
    return (
      <div className='list-group lg-even-black'>
        {header}
        {renderElements()}
      </div>
    )
  }
}

ListContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

ListContainer.propTypes = {
  header: PropTypes.element,
  elements: PropTypes.array.isRequired,
  onLoad: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLastPage: PropTypes.bool.isRequired
}

export default ListContainer
