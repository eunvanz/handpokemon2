import React from 'react'
import PropTypes from 'prop-types'
import { Menu, MainButton, ChildButton } from 'react-mfb'

class MaterialFloatingButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      effect: 'zoomin',
      pos: 'br',
      method: 'hover'
    }
  }
  render () {
    const { effect, pos, method } = this.state
    return (
      <Menu effect={effect} method={method} position={pos}>
        <MainButton iconResting='ion-plus-round' iconActive='ion-close-round' />
        <ChildButton
          icon='ion-social-github'
          label='test'
        />
      </Menu>
    )
  }
}

MaterialFloatingButton.contextTypes = {
  router: PropTypes.object.isRequired
}

MaterialFloatingButton.propTypes = {

}

export default MaterialFloatingButton
