import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import MonRank from 'components/MonRank'
import MonAttr from 'components/MonAttr'
import MonCost from 'components/MonCost'
import Stat from 'components/Stat'
import Button from 'components/Button'
import Info from 'components/Info'

import { getMonImage } from 'utils/monUtil'
import { getMsg } from 'utils/commonUtil'

import withIntl from 'hocs/withIntl'

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
    const { monObj, type, forModal, user, locale } = this.props
    let honorBurf = [0, 0, 0, 0, 0, 0]
    const getHonorBurf = () => {
      const result = [0, 0, 0, 0, 0, 0]
      user.enabledHonors.forEach(honor => {
        for (let i = 0; i < result.length; i++) {
          result[i] += honor.burf[i]
        }
      })
      return result
    }
    if (user && user.enabledHonors) honorBurf = getHonorBurf()
    const honorTotal = honorBurf ? honorBurf.reduce((accm, burf) => accm + burf, 0) : 0
    const mon = monObj.tobe
    const asisMon = monObj.asis
    let monToView = type === 'collection' || type === 'defender' ? mon.mon[mon.monId] : mon
    const colClassName = forModal ? 'col-sm-8 col-xs-12 text-left' : 'col-sm-4 col-sm-offset-4 text-left'
    const renderInfo = () => {
      const renderTotal = () => {
        if (type === 'collection' || type === 'defender') {
          if (asisMon) {
            return (
              <div className='col-xs-9 f-700'>
                <span className='c-blue'>{mon.total + mon.addedTotal + (honorTotal || 0)}</span> (<span className='c-gray'>{asisMon.total}</span><span className='c-green'>{honorTotal !== 0 ? ` +${honorTotal}` : ''}</span>{asisMon.addedTotal > 0 && <span className='c-orange'> +{asisMon.addedTotal}</span>}<span className='c-lightblue'> +{mon.addedTotal - asisMon.addedTotal}</span>)
              </div>
            )
          } else {
            return (
              <div className='col-xs-9 f-700'>
                <span className='c-blue'>{mon.total + mon.addedTotal + (honorTotal || 0)}</span> {(mon.addedTotal > 0 || honorTotal !== 0) && <span>(<span className='c-gray'>{mon.total}</span><span className='c-green'>{honorTotal !== 0 ? ` +${honorTotal}` : ''}</span><span className='c-orange'>{mon.addedTotal === 0 ? '' : ` +${mon.addedTotal}`}</span>)</span>}
              </div>
            )
          }
        } else {
          return <div className='col-xs-9'>평균 <span className='c-blue f-700'>{mon.total}</span></div>
        }
      }
      return (
        <div className='m-b-20'>
          {
            !this.state.showStat &&
            <div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>이름</div>
                <div className='col-xs-9'>{mon.mon ? getMsg(monToView.name, locale) : '????'}</div>
              </div>
              {mon.rank && <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>랭크 <Info id='rankInfo' title='랭크' content='SS~F까지의 랭크가 존재하며, 높은 등급의 랭크일수록 전투력이 높습니다. 랭크는 새로운 포켓몬 채집시에 결정됩니다.' /></div>
                <div className='col-xs-9'><MonRank rank={mon.rank} /></div>
              </div>}
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>등급 <Info id='gradeInfo' title='등급' content={<div>등급마다 얻을 수 있는 방법이 다릅니다.<br />BASIC: 채집<br />SPECIAL: BASIC 진화<br />RARE: BASIC 혹은 SPECIAL간의 교배<br />S.RARE: RARE의 진화<br />ELITE: RARE 혹은 S.RARE간의 교배<br />LEGEND: ELITE간의 교배</div>} /></div>
                <div className='col-xs-9'><MonAttr grade={monToView.grade} point={monToView.point} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>속성 <Info id='attrInfo' title='속성' content={<div>속성별로 상성이 있습니다. 두 개의 속성을 가진 포켓몬의 경우 중첩하여 적용됩니다. 상성표는 <Link to='/board-list/guide/-L0uGqchkF06RvRU5R6V'>이곳</Link>을 참고해주세요.</div>} /></div>
                <div className='col-xs-9'><MonAttr mainAttr={monToView.mainAttr} subAttr={monToView.subAttr} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>코스트 <Info id='costInfo' title='코스트' content='시합에서 사용할 수 있는 최대 코스트는 정해져있습니다. 코스트가 적으면서 전투력이 높은 포켓몬이 좋은 포켓몬이겠죠?' /></div>
                <div className='col-xs-9'><MonCost cost={monToView.cost} /></div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>전투력 <Info id='battleInfo' title='전투력' content='체력, 공격, 방어, 특수공격, 특수방어, 민첩 능력치를 합친 값입니다.' /></div>
                {renderTotal()}
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>피지컬</div>
                <div className='col-xs-9'>{type === 'mon' ? '평균 ' : ''}<span className='f-700 c-blue'>{mon.height}</span>m / {type === 'mon' ? '평균 ' : ''}<span className='f-700 c-blue'>{mon.weight}</span>kg</div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-3 f-700'>진화</div>
                <div className='col-xs-9'>{monToView.evoLv > 0 ? `LV.${monToView.evoLv} 부터 가능` : '-'}</div>
              </div>
              <div className='row' style={{ marginBottom: '15px' }}>
                <div className='col-xs-12'>{getMsg(monToView.description, locale)} (designed by <span className='f-700 c-blue'>{getMonImage(mon).designer}</span>)</div>
              </div>
            </div>
          }
          {
            this.state.showStat &&
            <div>
              {
                !asisMon &&
                <div>
                  <Stat label={mon.mon ? '체력' : '평균 체력'} value={mon.hp} addedValue1={mon.addedHp ? mon.addedHp : 0} addedValue2={0} preValue={honorBurf[0]} />
                  <Stat label={mon.mon ? '공격' : '평균 공격'} value={mon.power} addedValue1={mon.addedPower ? mon.addedPower : 0} addedValue2={0} preValue={honorBurf[1]} />
                  <Stat label={mon.mon ? '방어' : '평균 방어'} value={mon.armor} addedValue1={mon.addedArmor ? mon.addedArmor : 0} addedValue2={0} preValue={honorBurf[2]} />
                  <Stat label={mon.mon ? '특수공격' : '평균 특수공격'} value={mon.sPower} addedValue1={mon.addedSPower ? mon.addedSPower : 0} addedValue2={0} preValue={honorBurf[3]} />
                  <Stat label={mon.mon ? '특수방어' : '평균 특수방어'} value={mon.sArmor} addedValue1={mon.addedSArmor ? mon.addedSArmor : 0} addedValue2={0} preValue={honorBurf[4]} />
                  <Stat label={mon.mon ? '민첩' : '평균 민첩'} value={mon.dex} addedValue1={mon.addedDex ? mon.addedDex : 0} addedValue2={0} preValue={honorBurf[5]} />
                </div>
              }
              {
                asisMon &&
                <div>
                  <Stat label={mon.mon ? '체력' : '평균 체력'} value={mon.hp} addedValue1={asisMon.addedHp} addedValue2={mon.addedHp - asisMon.addedHp} preValue={honorBurf[0]} />
                  <Stat label={mon.mon ? '공격' : '평균 공격'} value={mon.power} addedValue1={asisMon.addedPower} addedValue2={mon.addedPower - asisMon.addedPower} preValue={honorBurf[1]} />
                  <Stat label={mon.mon ? '방어' : '평균 방어'} value={mon.armor} addedValue1={asisMon.addedArmor} addedValue2={mon.addedArmor - asisMon.addedArmor} preValue={honorBurf[2]} />
                  <Stat label={mon.mon ? '특수공격' : '평균 특수공격'} value={mon.sPower} addedValue1={asisMon.addedSPower} addedValue2={mon.addedSPower - asisMon.addedSPower} preValue={honorBurf[3]} />
                  <Stat label={mon.mon ? '특수방어' : '평균 특수방어'} value={mon.sArmor} addedValue1={asisMon.addedSArmor} addedValue2={mon.addedSArmor - asisMon.addedSArmor} preValue={honorBurf[4]} />
                  <Stat label={mon.mon ? '민첩' : '평균 민첩'} value={mon.dex} addedValue1={asisMon.addedDex} addedValue2={mon.addedDex - asisMon.addedDex} preValue={honorBurf[5]} />
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
              <Button text='뒤집기' icon='fa fa-sync'
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
  forModal: PropTypes.bool,
  user: PropTypes.object,
  locale: PropTypes.string.isRequired
}

export default withIntl(MonInfo)
