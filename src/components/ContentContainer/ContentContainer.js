import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import Card from 'components/Card'

import { isScreenSize } from 'utils/commonUtil'

class ContentContainer extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div className='container container-alt' style={Object.assign({}, { padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }, this.props.style)}>
        {
          this.props.title &&
          <div className='block-header'>
            <h1 style={{ fontSize: '23px' }}>{this.props.title}</h1>
          </div>
        }
        <Card stickyHeader={this.props.stickyHeader} headerBgColor={this.props.headerBgColor} header={this.props.header} body={this.props.body} clearPadding={this.props.clearPadding} />
      </div>
    )
  }
}

ContentContainer.propTypes = {
  title: PropTypes.string,
  body: PropTypes.element,
  header: PropTypes.element,
  clearPadding: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  headerBgColor: PropTypes.string,
  style: PropTypes.object
}

export default ContentContainer
