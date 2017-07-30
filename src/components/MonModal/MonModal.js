import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from 'components/CustomModal'
import MonAttr from 'components/MonAttr'
import MonCost from 'components/MonCost'
import Button from 'components/Button'
import Stat from 'components/Stat'
import MonLevel from 'components/MonLevel'
import MonRank from 'components/MonRank'

import { getMonImage } from 'utils/monUtil'

class MonModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      side: true
    }
  }
  render () {
    const { mon, show, close, type, ...restProps } = this.props
    let monToView = type === 'collection' ? mon.mon : mon
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
          {
            this.state.side &&
            <div className='col-sm-8 col-xs-12 text-left'>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>이름</div>
                <div className='col-xs-9'>{monToView.name}</div>
              </div>
              {mon.rank && <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>랭크</div>
                <div className='col-xs-9'><MonRank rank={mon.rank} /></div>
              </div>}
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>등급</div>
                <div className='col-xs-9'><MonAttr grade={monToView.grade} point={monToView.point} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>속성</div>
                <div className='col-xs-9'><MonAttr mainAttr={monToView.mainAttr} subAttr={monToView.subAttr} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>코스트</div>
                <div className='col-xs-9'><MonCost cost={monToView.cost} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>전투력</div>
                <div className='col-xs-9 c-blue f-700'>{mon.total}</div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>피지컬</div>
                <div className='col-xs-9'><span className='f-700 c-blue'>{mon.height}</span>m / <span className='f-700 c-blue'>{mon.weight}</span>kg</div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>진화</div>
                <div className='col-xs-9'>{monToView.evoLv > 0 ? `LV.${monToView.evoLv} 부터 가능` : '-'}</div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-12'>{monToView.description} (designed by <span className='f-700 c-blue'>{getMonImage(mon).designer.nickname}</span>)</div>
              </div>
            </div>
          }
          {
            !this.state.side &&
            <div className='col-sm-8 col-xs-12 text-left'>
              <Stat label='체력' value={mon.hp} addedValue={mon.addedHp} />
              <Stat label='공격' value={mon.power} addedValue={mon.addedPower} />
              <Stat label='방어' value={mon.armor} addedValue={mon.addedArmor} />
              <Stat label='특수공격' value={mon.sPower} addedValue={mon.addedSPower} />
              <Stat label='특수방어' value={mon.sArmor} addedValue={mon.addedSArmor} />
              <Stat label='민첩' value={mon.dex} addedValue={mon.addedDex} />
            </div>
          }
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          <Button link text='닫기' onClick={close} />
          <Button text='뒤집기' icon='fa fa-refresh'
            onClick={() => this.setState({ side: !this.state.side })} />
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
