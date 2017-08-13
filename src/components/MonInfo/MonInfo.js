import React from 'react'
import PropTypes from 'prop-types'

import MonRank from 'components/MonRank'
import MonAttr from 'components/MonAttr'
import MonCost from 'components/MonCost'
import Stat from 'components/Stat'
import Button from 'components/Button'

import { getMonImage } from 'utils/monUtil'

class MonInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showStat: props.showStat
    }
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.showStat !== this.props.showStat) this.setState({ showStat: nextProps.showStat })
  }
  render () {
    const { monObj, type, forModal } = this.props
    const mon = monObj.tobe
    const asisMon = monObj.asis
    let monToView = type === 'collection' ? mon.mon : mon
    const colClassName = forModal ? 'col-sm-8 col-xs-12 text-left' : 'col-sm-4 col-sm-offset-4 text-left'
    const renderInfo = () => {
      return (
        <div className='row m-b-20'>
          {
            !this.state.showStat &&
            <div>
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
                <div className='col-xs-12'>{monToView.description} (designed by <span className='f-700 c-blue'>{getMonImage(mon).designer}</span>)</div>
              </div>
            </div>
          }
          {
            this.state.showStat &&
            <div>
              {
                !asisMon &&
                <div>
                  <Stat label='체력' value={mon.hp} addedValue1={mon.addedHp ? mon.addedHp : 0} addedValue2={0} />
                  <Stat label='공격' value={mon.power} addedValue1={mon.addedPower ? mon.addedPower : 0} addedValue2={0} />
                  <Stat label='방어' value={mon.armor} addedValue1={mon.addedArmor ? mon.addedArmor : 0} addedValue2={0} />
                  <Stat label='특수공격' value={mon.sPower} addedValue1={mon.addedSPower ? mon.addedSPower : 0} addedValue2={0} />
                  <Stat label='특수방어' value={mon.sArmor} addedValue1={mon.addedSArmor ? mon.addedSArmor : 0} addedValue2={0} />
                  <Stat label='민첩' value={mon.dex} addedValue1={mon.addedDex ? mon.addedDex : 0} addedValue2={0} />
                </div>
              }
              {
                asisMon &&
                <div>
                  <Stat label='체력' value={mon.hp} addedValue1={asisMon.addedHp} addedValue2={mon.addedHp - asisMon.addedHp} />
                  <Stat label='공격' value={mon.power} addedValue1={asisMon.addedPower} addedValue2={mon.addedPower - asisMon.addedPower} />
                  <Stat label='방어' value={mon.armor} addedValue1={asisMon.addedArmor} addedValue2={mon.addedArmor - asisMon.addedArmor} />
                  <Stat label='특수공격' value={mon.sPower} addedValue1={asisMon.addedSPower} addedValue2={mon.addedSPower - asisMon.addedSPower} />
                  <Stat label='특수방어' value={mon.sArmor} addedValue1={asisMon.addedSArmor} addedValue2={mon.addedSArmor - asisMon.addedSArmor} />
                  <Stat label='민첩' value={mon.dex} addedValue1={asisMon.addedDex} addedValue2={mon.addedDex - asisMon.addedDex} />
                </div>
              }
            </div>
          }
        </div>
      )
    }
    return (
      <div className={colClassName}>
        {renderInfo()}
        {
          !forModal &&
          <div className='row'>
            <div className='col-xs-12 text-center'>
              <Button text='뒤집기' icon='fa fa-refresh'
                onClick={() => this.setState({ showStat: !this.state.showStat })} />
            </div>
          </div>
        }
      </div>
    )
  }
}

MonInfo.contextTypes = {
  router: PropTypes.object.isRequired
}

MonInfo.propTypes = {
  monObj: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  showStat: PropTypes.bool,
  forModal: PropTypes.bool
}

export default MonInfo