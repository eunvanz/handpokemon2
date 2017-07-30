import React from 'react'
import PropTypes from 'prop-types'

import Card from 'components/Card'

import { isScreenSize } from 'utils/commonUtil'

class ContentContainer extends React.Component {
  render () {
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        {
          this.props.title &&
          <div className='block-header'>
            <h1 style={{ fontSize: '23px' }}>{this.props.title}</h1>
          </div>
        }
        <Card header={this.props.header} body={this.props.body} />
      </div>
    )
  }
}

ContentContainer.propTypes = {
  title: PropTypes.string,
  body: PropTypes.element,
  header: PropTypes.element
}

export default ContentContainer
