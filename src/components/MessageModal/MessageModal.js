import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import CustomModal from '../CustomModal'
import Button from '../Button'

class MessageModal extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'MessageModal'
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props))
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ showModal: nextProps.show })
    if (nextProps.show) {
      document.addEventListener('keyup', event => {
        const { keyCode } = event
        if (keyCode === 13) {
          this.props.onConfirmClick()
        } else if (keyCode === 27) {
          this.props.close()
        }
      })
    } else if (nextProps.show === false) {
      document.removeEventListener('keyup', () => {})
    }
  }
  render () {
    const { title, message, show, cancelBtnTxt, confirmBtnTxt, onConfirmClick, close, process, ...restProps } = this.props
    const renderBody = () => {
      return (
        <div>{message}</div>
      )
    }
    const renderCancelBtn = () => {
      if (cancelBtnTxt) {
        return (
          <Button link text={cancelBtnTxt} onClick={close} />
        )
      }
    }
    const renderConfirmBtn = () => {
      return (
        <Button link text={confirmBtnTxt} onClick={onConfirmClick} loading={process} />
      )
    }
    const renderFooter = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          { renderCancelBtn() }
          { renderConfirmBtn() }
        </div>
      )
    }
    return (
      <div>
        <CustomModal
          bodyComponent={renderBody()}
          footerComponent={renderFooter()}
          show={show}
          close={close}
          backdrop
          {...restProps}
          id='messageModal'
        />
      </div>
    )
  }
}

MessageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  cancelBtnTxt: PropTypes.string,
  confirmBtnTxt: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func,
  process: PropTypes.bool,
  width: PropTypes.number
}

export default MessageModal
