import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import MonLevel from 'components/MonLevel'
import MonInfo from 'components/MonInfo'

import { getMonImage } from 'utils/monUtil'

import { colors } from 'constants/colors'

class MonModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showStat: false
    }
  }
  render () {
    const { mon, show, close, type, ...restProps } = this.props
    const tobeMon = mon.tobe
    const renderLevel = () => {
      if (mon.asis) {
        return (
          <div className='text-center m-b-30' style={{ height: '60px' }}>
            <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'medium'}} />
          </div>
        )
      }
      return <MonLevel level={tobeMon.level} />
    }
    const renderBody = () => {
      return (
        <div className='row'>
          <div className='col-sm-4 col-xs-12 text-center' style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px' }}>
              <img src={getMonImage(tobeMon).url} width='100%'
                style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} />
            </p>
            {tobeMon.level &&
              renderLevel()
            }
          </div>
          <MonInfo monObj={mon} showStat={this.state.showStat} type={type} forModal />
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
  mon: PropTypes.object, // asis, tobe
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  type: PropTypes.string
}

export default MonModal
