import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'

import { getMonImage } from 'utils/monUtil'

class MonModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showStat: false
    }
  }
  render () {
    const { mon, show, close, type, ...restProps } = this.props
    const renderBody = () => {
      return (
        <div className='row'>
          <div className='col-sm-4 col-xs-12 text-center' style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px' }}>
              <img src={getMonImage(mon).url} width='100%'
                style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} />
            </p>
            {mon.level &&
              <MonLevel level={mon.level} />
            }
          </div>
          <MonInfo monObj={{ tobe: mon }} showStat={this.state.showStat} type={type} forModal />
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button link text='닫기' onClick={close} />
          <Button text='뒤집기' icon='fa fa-refresh'
            onClick={() => this.setState({ showStat: !this.state.showStat })} />
        </div>
      )
    }
    return (
      <CustomModal
        title='포켓몬 정보'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        show={show}
        close={close}
        backdrop
        {...restProps}
      />
    )
  }
}

MonModal.propTypes = {
  mon: PropTypes.object,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  type: PropTypes.string
}

export default MonModal
