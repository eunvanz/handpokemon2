import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'

class HonorView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldUpdateComponent (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const renderBody = () => {
      
    }
    return (
      <ContentContainer
        title='업적'
        body={renderBody()}
      />
    )
  }
}

HonorView.contextTypes = {
  router: PropTypes.object.isRequired
}

HonorView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  honors: PropTypes.array.isRequired
}

export default HonorView
