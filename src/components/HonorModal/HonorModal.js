import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import HonorBadge from 'components/HonorBadge'

class HonorModal extends React.Component {
  shouldUpdateComponent (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { honorModalInfo, close } = this.props
    const { honors, messages, show } = honorModalInfo
    const renderBody = () => {
      if (!honors) return <div />
      return honors.map((honor, idx) => {
        return (
          <div className='m-t-20 m-b-20 text-center' key={idx}>
            <p className='m-b-10'>{messages[idx]}</p>
            <HonorBadge honor={honor} /> (<span className='f-700 c-lightblue'>+{honor.reward}</span> 포키머니)
          </div>
        )
      })
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button text='확인' onClick={close} />
        </div>
      )
    }
    return (
      <CustomModal
        title='칭호'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        id='honor-modal'
        show={show}
        close={close}
        width={500}
      />
    )
  }
}

HonorModal.propTypes = {
  close: PropTypes.func.isRequired,
  honorModalInfo: PropTypes.object.isRequired
}

export default HonorModal
