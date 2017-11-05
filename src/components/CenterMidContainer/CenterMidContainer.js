import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import $ from 'jquery'

class CenterMidContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount () {
    $('#divToAlignCenter').css('height', $('#main').height() - 180)
    $('#divToAlignMid').css('top', $('#divToAlignCenter').height() / 2 - $('#divToAlignMidBody').height() / 2)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { bodyComponent } = this.props
    return (
      <div id='divToAlignCenter' className='text-center' style={{ height: `{$('#main').height() - 60}px` }}>
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
  bodyComponent: PropTypes.element.isRequired
}

export default CenterMidContainer
