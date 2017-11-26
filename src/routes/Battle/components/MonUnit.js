import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import { isScreenSize } from 'utils/commonUtil'
import { colors } from 'constants/colors'

import Img from 'components/Img'
import MonModal from 'components/MonModal'
import MonLevel from 'components/MonLevel'
import MonRank from 'components/MonRank'

class MonUnit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMonModal: false
    }
  }
  componentDidMount () {
    const { id } = this.props
    $(`#${id}-damageInfo`).css('left', ($(`#${id}`).width() / 2) - ($(`#${id}-damageInfo`).width() / 2))
    $(`#${id}-specialInfo`).css('left', ($(`#${id}`).width() / 2) - ($(`#${id}-damageInfo`).width() / 2))
    $(`#${id}-attrBonusInfo`).css('left', ($(`#${id}`).width() / 2) - ($(`#${id}-damageInfo`).width() / 2))
  }
  render () {
    const { mon, id, ...props } = this.props
    return (
      <div className='col-xs-4 text-center' id={id} {...props}>
        <div className='c-red' id={`${id}-damageInfo`} style={{ opacity: '0', position: 'absolute' }}></div>
        <div className='c-green' id={`${id}-specialInfo`} style={{ opacity: '0', position: 'absolute', fontSize: isScreenSize.xs() ? '14px' : '16px' }}>{mon.col.mon[mon.col.monId].skill}</div>
        <div id={`${id}-attrBonusInfo`} style={{ opacity: '0', position: 'absolute', fontSize: '16px' }}></div>
        <div className='progress' id={`${id}-hpGuage`} style={{ margin: 'auto', width: isScreenSize.xs() ? '64%' : '40%', maxWidth: '96px', marginBottom: isScreenSize.xs() ? '5px' : '10px', backgroundColor: 'red' }}>
          <div className='progress-bar restHp' style={{ backgroundColor: colors.amber, width: `${(mon.restHp * 100) / mon.totalHp}%` }} />
        </div>
        <Img src={mon.col.mon[mon.col.monId].monImage[mon.col.imageSeq].url} style={{ width: isScreenSize.xs() ? '70%' : '50%', maxWidth: '120px' }} onClick={() => this.setState({ showMonModal: true })} />
        <div style={{ margin: 'auto', fontSize: isScreenSize.xs() ? '10px' : '12px', marginTop: isScreenSize.xs() ? '5px' : '10px' }}>
          {
            isScreenSize.largerThan('xs') &&
            <MonLevel level={mon.col.level} />
          }
          {
            isScreenSize.largerThan('xs') &&
            <MonRank rank={mon.col.rank} style={{ position: 'relative' }} />
          }
          <span className='restHpText'> {mon.restHp}</span> / {mon.totalHp}
        </div>
        <MonModal mon={{ tobe: mon.col }} type={'collection'} show={this.state.showMonModal} isNotMine
          close={() => this.setState({ showMonModal: false })} />
      </div>
    )
  }
}

MonUnit.propTypes = {
  mon: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
}

export default MonUnit
