import React from 'react'
import PropTypes from 'prop-types'

import { isScreenSize, getMsg } from 'utils/commonUtil'
import { colors } from 'constants/colors'

import Img from 'components/Img'
import MonModal from 'components/MonModal'
import MonAttr from 'components/MonAttr'

class MonUnit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMonModal: false
    }
  }
  render () {
    const { mon, id, user, locale, ...props } = this.props
    return (
      <div className='col-xs-4 text-center' id={id} {...props}>
        <div className='c-red text-center' id={`${id}-damageInfo`} style={{ opacity: '0', position: 'absolute', width: 'calc(100% - 30px)' }}></div>
        <div className='c-green text-center' id={`${id}-specialInfo`} style={{ opacity: '0', position: 'absolute', fontSize: isScreenSize.xs() ? '14px' : '16px', width: 'calc(100% - 30px)' }}>{getMsg(mon.col.mon[mon.col.monId].skill, locale)}</div>
        <div className='text-center' id={`${id}-attrBonusInfo`} style={{ opacity: '0', position: 'absolute', fontSize: '16px', width: 'calc(100% - 30px)' }}></div>
        <div className='progress' id={`${id}-hpGuage`} style={{ margin: 'auto', width: isScreenSize.xs() ? '64%' : '40%', maxWidth: '96px', marginBottom: isScreenSize.xs() ? '5px' : '10px', backgroundColor: 'red' }}>
          <div className='progress-bar restHp' style={{ backgroundColor: colors.amber, width: `${(mon.restHp * 100) / mon.totalHp}%` }} />
        </div>
        <Img cache src={mon.col.mon[mon.col.monId].monImage.filter(item => item.seq === mon.col.imageSeq)[0].url} style={{ width: isScreenSize.xs() ? '70%' : '50%', maxWidth: '120px' }} onClick={() => this.setState({ showMonModal: true })} />
        <div style={{ margin: 'auto', fontSize: isScreenSize.xs() ? '10px' : '12px', marginTop: isScreenSize.xs() ? '5px' : '10px' }}>
          {
            isScreenSize.largerThan('xs') &&
            <MonAttr mainAttr={mon.col.mon[mon.col.monId].mainAttr} subAttr={mon.col.mon[mon.col.monId].subAttr} style={{ marginBottom: '5px' }} />
          }
          <span className='restHpText'> {mon.restHp}</span> / {mon.totalHp}
        </div>
        <MonModal mon={{ tobe: mon.col }} type={'collection'} show={this.state.showMonModal} isNotMine user={user}
          close={() => this.setState({ showMonModal: false })} locale={locale} />
      </div>
    )
  }
}

MonUnit.propTypes = {
  mon: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.object,
  locale: PropTypes.string.isRequired
}

export default MonUnit
