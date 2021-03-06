import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { firebaseConnect } from 'react-redux-firebase'
import numeral from 'numeral'
import { compose } from 'recompose'

import MonCost from '../MonCost'
import MonAttr from '../MonAttr'
import MonModal from '../MonModal'
import MonRank from '../MonRank'
import MonLevel from '../MonLevel'
import Img from '../Img'
import LabelBadge from '../LabelBadge'
import StatusBadge from '../StatusBadge'
import Button from '../Button'

import { getMonImage, isMaxLevel } from 'utils/monUtil'

import { toggleFavorite } from 'services/CollectionService'

import { colors } from 'constants/colors'

import unloader from './assets/unloader.png'

import withIntl from 'hocs/withIntl'

class MonCard extends React.Component {
  constructor (props) {
    super(props)
    const { mon, user } = props
    const tobeMon = mon ? mon.tobe : null
    this.state = {
      showMonModal: false,
      isSelected: props.isSelected || false,
      isFavorite: tobeMon ? tobeMon.isFavorite : false,
      isMaxLevel: tobeMon && tobeMon.level && user ? isMaxLevel(tobeMon, user) : false
    }
    this._showMonModal = this._showMonModal.bind(this)
    this._handleOnSelect = this._handleOnSelect.bind(this)
    this._handleOnUnselect = this._handleOnUnselect.bind(this)
    this._handleOnClickFavorite = this._handleOnClickFavorite.bind(this)
    this._handleOnClickShield = this._handleOnClickShield.bind(this)
  }
  componentDidMount () {
    const { mon } = this.props
    if (mon && mon.maxLevel) {
      let text
      if (mon.tobe.mon[mon.tobe.monId].grade === 's' || mon.tobe.mon[mon.tobe.monId].grade === 'sr') {
        text = `이미 ${mon.tobe.mon[mon.tobe.monId].name.ko}이(가) 최대레벨에 도달했으므로 ${mon.tobe.mon[mon.tobe.monId].point * 5}P를 획득했습니다.`
      } else {
        text = `이미 ${mon.tobe.mon[mon.tobe.monId].name.ko}이(가) 최대레벨에 도달했으므로 채집권을 획득했습니다.`
      }
      window.swal({
        title: '최대레벨',
        text,
        type: 'success'
      })
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.isSelected !== this.props.isSelected) {
      this.setState({ isSelected: this.props.isSelected })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _showMonModal (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ showMonModal: true })
  }
  _handleOnSelect () {
    if (this.props.isToggleable) this.setState({ isSelected: true })
    this.props.onSelect()
  }
  _handleOnUnselect () {
    if (this.props.isToggleable) this.setState({ isSelected: false })
    this.props.onUnselect()
  }
  _handleOnClickFavorite (e) {
    e.preventDefault()
    e.stopPropagation()
    const { firebase, mon } = this.props
    const isFavoriteToSet = !this.state.isFavorite
    toggleFavorite(firebase, mon.tobe, isFavoriteToSet)
    .then(() => {
      this.setState({ isFavorite: isFavoriteToSet })
    })
  }
  _handleOnClickShield (e) {
    e.preventDefault()
    e.stopPropagation()
    const { onClickShield, mon } = this.props
    onClickShield(mon.tobe)
  }
  render () {
    const { mon, pick, className, type, isSelectable, onUnselect, isToggleable, isSelected, noMonOfTheMatch, blinkInfo,
      isNotMine, firebase, showStatusBadge, isDummy, onClickShield, onClickSetDefenderBtn, blinkMix, blinkCost, blinkRank,
      isCustomSize, disableChangeBtn, user, kills, point, isMom, locale, messages, dispatch, showBattery, ...restProps } = this.props
    const { isMaxLevel } = this.state
    const tobeMon = mon ? mon.tobe : null
    const renderSetDefenderBtn = () => {
      return <Button
        className='m-t-5'
        size='xs'
        color={isDummy ? 'green' : 'orange'}
        text={isDummy ? '추가' : '교체'}
        icon={isDummy ? 'fa fa-plus' : 'fa fa-sync'}
        onClick={onClickSetDefenderBtn}
        disabled={disableChangeBtn}
      />
    }
    const renderLevelUpInfo = () => {
      if (isDummy) return null
      if (mon.asis) {
        // 레벨 업 시
        return <div className='text-center m-b-30' style={{ height: '60px' }}>
          <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small' }} isMaxLevel={isMaxLevel} />
          <p className='m-t-5'>레벨 <span className='c-lightblue f-700'>+{mon.tobe.level - mon.asis.level}</span></p>
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
      <div className={`${isCustomSize ? '' : 'col-md-2 col-sm-3 col-xs-6'} text-left ${className || ''}${blinkMix ? ' blink-opacity' : ''}`} {...restProps}
        style={{ padding: '0px 5px' }} onClick={isSelectable ? (this.state.isSelected ? this._handleOnUnselect : this._handleOnSelect) : this._showMonModal}
      >
        {!isDummy && (type === 'collection' || type === 'defender') && <MonLevel level={tobeMon.level} isMaxLevel={isMaxLevel}
          style={{ position: 'absolute', top: '0px', borderRadius: '0px 0px 2px 0px', backgroundColor: tobeMon.level >= (tobeMon.mon[tobeMon.monId].evoLv === 0 ? 99999 : tobeMon.mon[tobeMon.monId].evoLv) ? colors.deepOrange : colors.lightBlue }} />}
        <div className='text-right' style={{ marginRight: '18px' }}>
          {!isDummy && (type === 'collection' || type === 'defender') && <MonRank rank={tobeMon.rank} style={{ borderRadius: '0px 0px 0px 2px' }} blink={blinkRank} />}
        </div>
        <div className='c-item'
          style={{
            cursor: 'pointer',
            border: this.state.isSelected ? '1px solid #ff9800' : '1px solid #e2e2e2',
            marginBottom: '8px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px',
            backgroundColor: 'white'
          }}>
          <a className='ci-avatar'>
            <Img cache id={tobeMon && tobeMon.id} src={(type === 'collection' || type === 'defender') && !isDummy ? getMonImage(tobeMon).url : unloader} width='100%' height='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
            {
              showStatusBadge &&
              <StatusBadge icon='zmdi zmdi-shield-check' side='left' isActive={tobeMon.isDefender} activeColor={colors.cyan} onClick={this._handleOnClickShield} />
            }
            {
              showBattery &&
              <StatusBadge icon={`far fa-battery-${tobeMon.battery === 0 ? 'empty' : tobeMon.battery === 1 ? 'half' : 'full'}`} side='left' isActive activeColor={tobeMon.battery === 0 ? colors.red : tobeMon.battery === 1 ? colors.orange : colors.green} onClick={this._handleOnClickShield} />
            }
            {
              showStatusBadge &&
              <StatusBadge icon='fa fa-heart' side='right' isActive={this.state.isFavorite} activeColor={colors.pink} onClick={this._handleOnClickFavorite} />
            }
            {
              isSelectable &&
              <StatusBadge icon={`fa fa-info${blinkInfo ? ' blink-opacity' : ''}`} side='right' isActive activeColor={colors.blueGray} onClick={this._showMonModal} />
            }
            <MonCost cost={isDummy ? 0 : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].cost : tobeMon.cost}
              style={{ marginBottom: '5px' }} blink={blinkCost} id={tobeMon && tobeMon.id} />
            <MonAttr grade={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].grade : tobeMon.grade}
              mainAttr={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].mainAttr : tobeMon.mainAttr}
              subAttr={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].subAttr : tobeMon.subAttr}
              style={{ marginBottom: '10px' }} isDummy={isDummy} />
            {
              isMom && !noMonOfTheMatch &&
              <div className='text-center c-white' style={{ position: 'absolute', width: 'calc(100% + 10px)', backgroundColor: colors.red, fontSize: '14px', top: '-25px', left: '-5px' }}>MON OF THE MATCH</div>
            }
          </div>
        </div>
        {
          kills !== undefined && point !== undefined &&
          <div className='text-center m-b-20'>
            <p className='m-b-0'>마무리: <span className='c-lightblue f-700'>{kills}</span></p>
            <p>포인트: <span className='c-lightblue f-700'>{numeral(point).format('0,0')}</span></p>
          </div>
        }
        {
          pick &&
          renderLevelUpInfo()
        }
        { !isDummy && <MonModal locale={locale} mon={mon} type={this.props.type} show={this.state.showMonModal} isNotMine={isNotMine} user={user} blinkMix={blinkMix} isMaxLevel={isMaxLevel}
          close={() => this.setState({ showMonModal: false })} firebase={firebase} />
        }
        {
          type === 'defender' &&
          <div className='text-center' style={{ marginBottom: '20px' }}>
            {renderSetDefenderBtn()}
          </div>
        }
      </div>
    )
  }
}

MonCard.propTypes = {
  mon: PropTypes.object, // asis, tobe
  className: PropTypes.string,
  type: PropTypes.string, // collection, mon
  pick: PropTypes.bool, // 채집시
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  isNotMine: PropTypes.bool,
  firebase: PropTypes.object,
  showStatusBadge: PropTypes.bool,
  isDummy: PropTypes.bool,
  onClickShield: PropTypes.func,
  onClickSetDefenderBtn: PropTypes.func,
  isCustomSize: PropTypes.bool,
  disableChangeBtn: PropTypes.bool,
  user: PropTypes.object,
  isToggleable: PropTypes.bool,
  isSelected: PropTypes.bool,
  kills: PropTypes.number,
  point: PropTypes.number,
  isMom: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  noMonOfTheMatch: PropTypes.bool,
  blinkMix: PropTypes.bool,
  blinkCost: PropTypes.bool,
  blinkRank: PropTypes.bool,
  showBattery: PropTypes.bool
}

export default compose(firebaseConnect(), withIntl)(MonCard)
