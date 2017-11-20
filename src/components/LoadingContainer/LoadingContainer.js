import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../Loading'
import ContentContainer from '../ContentContainer'
import CenterMidContainer from '../CenterMidContainer'

class LoadingContainer extends React.PureComponent {
  render () {
    const { text } = this.props
    return (
      <ContentContainer
        style={{ marginTop: '68px' }}
        body={
          <CenterMidContainer
            bodyComponent={
              <Loading text={text} />
            }
          />
        }
      />
    )
  }
}

LoadingContainer.propTypes = {
  text: PropTypes.string.isRequired
}

export default LoadingContainer
