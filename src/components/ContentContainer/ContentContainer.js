import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import Card from 'components/Card'

import { isScreenSize } from 'utils/commonUtil'

class ContentContainer extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props))
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('prevProps', prevProps)
    console.log('this.props', this.props)
    console.log('container updated')
  }
  render () {
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
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
  headerBgColor: PropTypes.string
}

export default ContentContainer
