import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import $ from 'jquery'

class CenterMidContainer extends React.PureComponent {
  componentDidMount () {
    $('#divToAlignCenter').css('height', $(`#${this.props.rootId || 'main'}`).height() - (this.props.clear ? 0 : 159))
    $('#divToAlignMid').css('top', $('#divToAlignCenter').height() / 2 - $('#divToAlignMidBody').height() / 2)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { bodyComponent, rootId } = this.props
    return (
      <div id='divToAlignCenter' className='text-center' style={{ height: `{$('${rootId || 'main'}').height() - 60}px` }}>
        <div id='divToAlignMid' style={{ position: 'relative' }}>
          <div id='divToAlignMidBody'>
            {bodyComponent}
          </div>
        </div>
      </div>
    )
  }
}

CenterMidContainer.propTypes = {
  bodyComponent: PropTypes.element.isRequired,
  rootId: PropTypes.string,
  clear: PropTypes.bool
}

export default CenterMidContainer
