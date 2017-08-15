import React from 'react'
import PropTypes from 'prop-types'

import MonCost from '../MonCost'
import MonAttr from '../MonAttr'
import MonModal from '../MonModal'
import MonRank from '../MonRank'
import MonLevel from '../MonLevel'
import Img from '../Img'
import LabelBadge from '../LabelBadge'

import { getMonImage } from 'utils/monUtil'

import { colors } from 'constants/colors'

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
    const { mon, pick, className, type, ...restProps } = this.props
    const tobeMon = mon.tobe
    const renderLevelUpInfo = () => {
      if (mon.asis) {
        // 레벨 업 시
        return <div className='text-center m-b-30' style={{ height: '60px' }}>
          <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small'}} />
        </div>
      } else {
        // 새로운 포켓몬
        return <div className='text-center m-b-30' style={{ height: '60px' }}>
          <LabelBadge text='새로운 포켓몬' style={{ fontSize: 'small', backgroundColor: colors.red }} />
          <p className='m-t-5'>콜렉션점수 <span className='c-lightblue f-700'>+{mon.tobe.mon[mon.tobe.monId].point}</span></p>
        </div>
      }
    }
    return (
      <div className={`col-md-2 col-sm-3 col-xs-6 text-left ${className || ''}`} {...restProps}
        style={{ padding: '0px 5px' }} onClick={this._showMonModal}
      >
        {type === 'collection' && <MonLevel level={tobeMon.level}
          style={{ position: 'absolute', top: '0px', borderRadius: '0px 0px 2px 0px' }} />}
        <div className='text-right' style={{ marginRight: '18px' }}>
          {type === 'collection' && <MonRank rank={tobeMon.rank} style={{ borderRadius: '0px 0px 0px 2px' }} />}
        </div>
        <div className='c-item'
          style={{
            cursor: 'pointer',
            border: '1px solid #e2e2e2',
            marginBottom: '20px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px'
          }}>
          <a className='ci-avatar'>
            <Img src={getMonImage(tobeMon).url} width='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          <div className='c-info text-center' style={{ margin: '5px 0px' }}>
            <MonCost cost={tobeMon.mon[tobeMon.monId].cost} style={{ marginBottom: '5px' }} />
            <MonAttr grade={tobeMon.mon[tobeMon.monId].grade} mainAttr={tobeMon.mon[tobeMon.monId].mainAttr}
              subAttr={tobeMon.mon[tobeMon.monId].subAttr}
              style={{ marginBottom: '10px' }} />
          </div>
        </div>
        {
          pick &&
          renderLevelUpInfo()
        }
        <MonModal mon={mon} type={this.props.type} show={this.state.showMonModal}
          close={() => this.setState({ showMonModal: false })} />
      </div>
    )
  }
}

MonCard.propTypes = {
  mon: PropTypes.object, // asis, tobe
  className: PropTypes.string,
  type: PropTypes.string,
  pick: PropTypes.bool // 채집시
}

export default MonCard
