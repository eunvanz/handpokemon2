import React from 'react'
import PropTypes from 'prop-types'

import MonCost from '../MonCost'
import MonAttr from '../MonAttr'
import MonModal from '../MonModal'
import MonRank from '../MonRank'
import MonLevel from '../MonLevel'

import { getMonImage } from 'utils/monUtil'

class MonCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMonModal: false
    }
    this._showMonModal = this._showMonModal.bind(this)
  }
  _showMonModal () {
    this.setState({ showMonModal: true })
  }
  render () {
    const { mon, className, type, ...restProps } = this.props
    return (
      <div className={`col-md-2 col-sm-3 col-xs-6 ${className}`} {...restProps}
        style={{ padding: '0px 5px' }} onClick={this._showMonModal}
      >
        {type === 'collection' && <MonLevel level={mon.level}
          style={{ position: 'absolute', top: '0px', borderRadius: '0px 0px 2px 0px' }} />}
        <div className='text-right' style={{ marginRight: '18px' }}>
          {type === 'collection' && <MonRank rank={mon.rank} style={{ borderRadius: '0px 0px 0px 2px' }} />}
        </div>
        <div className='c-item'
          style={{
            cursor: 'pointer',
            border: '1px solid #e2e2e2',
            marginBottom: '24px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px'
          }}>
          <a className='ci-avatar'>
            <img src={getMonImage(mon).url} width='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          <div className='c-info text-center' style={{ margin: '5px 0px' }}>
            <MonCost cost={mon.mon.cost} style={{ marginBottom: '5px' }} />
            <MonAttr grade={mon.mon.grade} mainAttr={mon.mon.mainAttr} subAttr={mon.mon.subAttr}
              style={{ marginBottom: '10px' }} />
          </div>
        </div>
        <MonModal mon={mon} type={this.props.type} show={this.state.showMonModal}
          close={() => this.setState({ showMonModal: false })} />
      </div>
    )
  }
}

MonCard.propTypes = {
  mon: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string
}

export default MonCard
