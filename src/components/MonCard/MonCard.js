import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { firebaseConnect } from 'react-redux-firebase'

import MonCost from '../MonCost'
import MonAttr from '../MonAttr'
import MonModal from '../MonModal'
import MonRank from '../MonRank'
import MonLevel from '../MonLevel'
import Img from '../Img'
import LabelBadge from '../LabelBadge'
import StatusBadge from '../StatusBadge'
import Button from '../Button'

import { getMonImage } from 'utils/monUtil'

import { toggleFavorite } from 'services/CollectionService'

import { colors } from 'constants/colors'

class MonCard extends React.Component {
  constructor (props) {
    super(props)
    const { mon } = props
    const tobeMon = mon ? mon.tobe : null
    this.state = {
      showMonModal: false,
      isSelected: false,
      isFavorite: tobeMon ? tobeMon.isFavorite : false
    }
    this._showMonModal = this._showMonModal.bind(this)
    this._handleOnSelect = this._handleOnSelect.bind(this)
    this._handleOnUnselect = this._handleOnUnselect.bind(this)
    this._handleOnClickFavorite = this._handleOnClickFavorite.bind(this)
    this._handleOnClickShield = this._handleOnClickShield.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _showMonModal () {
    this.setState({ showMonModal: true })
  }
  _handleOnSelect () {
    if (this.props.onSelect()) {
      this.setState({ isSelected: true })
    }
  }
  _handleOnUnselect () {
    this.setState({ isSelected: false })
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
    const { mon, pick, className, type, isSelectable, onUnselect, isNotMine, firebase, showStatusBadge, isDummy, onClickShield, onClickSetDefenderBtn, isCustomSize, disableChangeBtn, ...restProps } = this.props
    const tobeMon = mon ? mon.tobe : null
    const renderSetDefenderBtn = () => {
      return <Button
        className='m-t-5'
        size='xs'
        color={isDummy ? 'green' : 'orange'}
        text={isDummy ? '추가' : '교체'}
        icon={isDummy ? 'fa fa-plus' : 'fa fa-refresh'}
        onClick={onClickSetDefenderBtn}
        disabled={disableChangeBtn}
      />
    }
    const renderLevelUpInfo = () => {
      if (isDummy) return null
      if (mon.asis) {
        // 레벨 업 시
        return <div className='text-center m-b-30' style={{ height: '60px' }}>
          <MonLevel level={mon.asis.level} style={{ backgroundColor: colors.gray }} /> <i className='fa fa-long-arrow-right c-gray' /> <MonLevel level={mon.tobe.level} style={{ fontSize: 'small' }} />
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
      <div className={`${isCustomSize ? '' : 'col-md-2 col-sm-3 col-xs-6'} text-left ${className || ''}`} {...restProps}
        style={{ padding: '0px 5px' }} onClick={isSelectable ? (this.state.isSelected ? this._handleOnUnselect : this._handleOnSelect) : this._showMonModal}
      >
        {!isDummy && (type === 'collection' || type === 'defender') && <MonLevel level={tobeMon.level}
          style={{ position: 'absolute', top: '0px', borderRadius: '0px 0px 2px 0px', backgroundColor: tobeMon.level >= (tobeMon.mon[tobeMon.monId].evoLv === 0 ? 99999 : tobeMon.mon[tobeMon.monId].evoLv) ? colors.deepOrange : colors.lightBlue }} />}
        <div className='text-right' style={{ marginRight: '18px' }}>
          {!isDummy && (type === 'collection' || type === 'defender') && <MonRank rank={tobeMon.rank} style={{ borderRadius: '0px 0px 0px 2px' }} />}
        </div>
        <div className='c-item'
          style={{
            cursor: 'pointer',
            border: this.state.isSelected ? '2px solid #ff9800' : '1px solid #e2e2e2',
            marginBottom: '8px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px'
          }}>
          <a className='ci-avatar'>
            <Img src={(type === 'collection' || type === 'defender') && !isDummy ? getMonImage(tobeMon).url : 'hidden'} width='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
            {
              showStatusBadge &&
              <StatusBadge icon='zmdi zmdi-shield-check' side='left' isActive={tobeMon.isDefender} activeColor={colors.cyan} onClick={this._handleOnClickShield} />
            }
            {
              showStatusBadge &&
              <StatusBadge icon='fa fa-heart' side='right' isActive={this.state.isFavorite} activeColor={colors.pink} onClick={this._handleOnClickFavorite} />
            }
            <MonCost cost={isDummy ? 0 : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].cost : tobeMon.cost}
              style={{ marginBottom: '5px' }} />
            <MonAttr grade={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].grade : tobeMon.grade}
              mainAttr={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].mainAttr : tobeMon.mainAttr}
              subAttr={isDummy ? null : (type === 'collection' || type === 'defender') ? tobeMon.mon[tobeMon.monId].subAttr : tobeMon.subAttr}
              style={{ marginBottom: '10px' }} isDummy={isDummy} />
          </div>
        </div>
        {
          pick &&
          renderLevelUpInfo()
        }
        { !isDummy && <MonModal mon={mon} type={this.props.type} show={this.state.showMonModal} isNotMine={isNotMine}
          close={() => this.setState({ showMonModal: false })} />
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
  type: PropTypes.string,
  pick: PropTypes.bool, // 채집시
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  isNotMine: PropTypes.bool,
  firebase: PropTypes.object.isRequired,
  showStatusBadge: PropTypes.bool,
  isDummy: PropTypes.bool,
  onClickShield: PropTypes.func,
  onClickSetDefenderBtn: PropTypes.func,
  isCustomSize: PropTypes.bool,
  disableChangeBtn: PropTypes.bool
}

export default firebaseConnect()(MonCard)
