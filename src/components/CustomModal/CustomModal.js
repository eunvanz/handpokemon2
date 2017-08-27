import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import $ from 'jquery'
import { fromJS, is } from 'immutable'

class CustomModal extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'CustomModal'
    this.state = {
      showModal: this.props.show
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ showModal: nextProps.show })
  }
  componentDidUpdate () {
    // $('.modal-backdrop').css('z-index', '1030').css('height', '100%')
    if (this.props.width) {
      $('.modal-dialog').css('width', 'auto')
      $(`#${this.props.id}>.modal-dialog`).css('max-width', this.props.width)
    }
  }
  render () {
    const { title, bodyComponent, footerComponent, show, close, backdrop, id, width, ...restProps } = this.props
    const renderHeader = () => {
      if (this.props.title) {
        return (
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '18px' }}>{title}</Modal.Title>
          </Modal.Header>
        )
      }
    }
    return (
      <div {...restProps}>
        <Modal id={id} show={this.state.showModal} onHide={close} backdrop={backdrop}>
          {renderHeader()}
          <Modal.Body>
            {bodyComponent}
          </Modal.Body>
          <Modal.Footer>
            {footerComponent}
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

CustomModal.propTypes = {
  title: PropTypes.string,
  bodyComponent: PropTypes.element.isRequired,
  footerComponent: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  backdrop: PropTypes.any,
  id: PropTypes.string,
  width: PropTypes.number
}

export default CustomModal
