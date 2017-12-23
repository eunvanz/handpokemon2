import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import { Collapse } from 'react-bootstrap'
import keygen from 'keygenerator'
import { toast } from 'react-toastify'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import FloatingButton from 'components/FloatingButton'
import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import WarningText from 'components/WarningText'
import PieChart from 'components/PieChart'
import DefenderModal from 'components/DefenderModal'

import { getCollectionsByUserId, updateIsDefender } from 'services/CollectionService'
import { getUserByUserId, getUserRankingByUserId } from 'services/UserService'

import { attrs } from 'constants/data'
import { colors } from 'constants/colors'

import { showAlert, getMsg } from 'utils/commonUtil'

class CollectionView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: 'view',
      collections: null,
      filteredCollections: null,
      isInitializedMixMode: false,
      openFloatMenu: false,
      showFilterModal: false,
      quantity: null,
      userToView: null,
      showDefenderModal: false,
      defenders: [],
      isLoading: false,
      currentCol: null,
      filterCollapse: {
        has: false,
        grade: false,
        mainAttr: false,
        subAttr: false,
        cost: false,
        generation: false,
        isEvolutable: false
      },
      pieChartKey: keygen._(),
      collectionsKey: keygen._()
    }
    this._handleOnClickApplyFilter = this._handleOnClickApplyFilter.bind(this)
    this._handleOnClickFilter = this._handleOnClickFilter.bind(this)
    this._handleOnChangeFilterInput = this._handleOnChangeFilterInput.bind(this)
    this._initCollectionState = this._initCollectionState.bind(this)
    this._initMixMode = this._initMixMode.bind(this)
    this._handleOnSelectMon = this._handleOnSelectMon.bind(this)
    this._applyFilter = this._applyFilter.bind(this)
    this._cancelMix = this._cancelMix.bind(this)
    this._handleOnClickTrainerInfo = this._handleOnClickTrainerInfo.bind(this)
    this._handleOnClickApplyDefender = this._handleOnClickApplyDefender.bind(this)
    this._isMine = this._isMine.bind(this)
  }
  componentDidMount () {
    const { pickMonInfo, setTutorialModal, user } = this.props
    this._initCollectionState()
    .then(() => {
      if (pickMonInfo && pickMonInfo.mixCols) {
        this.setState({ mode: 'mix' })
      } else if (user && user.isTutorialOn && user.tutorialStep === 5) {
        setTutorialModal({
          show: true,
          content: <div>여기는 내 콜렉션을 관리할 수 있는 곳이야. 내가 모은 콜렉션과 모을 수 있는 콜렉션을 한눈에 볼 수 있지.</div>,
          onClickContinue: () => {
            setTutorialModal({
              show: true,
              content: <div>새로운 포켓몬을 얻을 수 있는 방법은 채집 뿐만이 아니야. 지금부터 포켓몬을 <span className='c-lightblue'>교배</span>해보는 시간을 가져보자.</div>,
              onClickContinue: () => {
                setTutorialModal({
                  show: true,
                  content: <div>내가 가지고 있는 포켓몬 중에 <span className='c-lightblue'>가장 마음에 안드는 포켓몬</span>의 상세정보 창을 띄우고 <span className='c-lightblue'>교배하기</span>버튼을 눌러봐.</div>,
                  onClickContinue: () => setTutorialModal({ show: false })
                })
              }
            })
          }
        })
      }
    })
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUpdate (nextProps, nextState) {
    if (!this.props.pickMonInfo && nextProps.pickMonInfo && nextProps.pickMonInfo.mixCols && nextProps.pickMonInfo.mixCols.length === 1) {
      this.setState({ mode: 'mix' })
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (!this.state.collections || !fromJS(prevProps.mons).equals(fromJS(this.props.mons)) || this.props.params.userId !== prevProps.params.userId) {
      this._initCollectionState()
    }
    if (this.state.mode === 'mix' && !this.state.isInitializedMixMode && this.props.pickMonInfo && this.props.pickMonInfo.mixCols && this.props.pickMonInfo.mixCols.length === 1) {
      if (!this.state.collections) {
        this._initCollectionState().then(() => this._initMixMode())
      } else {
        this._initMixMode()
      }
      const { user, setTutorialModal } = this.props
      if (user && user.isTutorialOn && user.tutorialStep === 5) {
        setTutorialModal({
          show: true,
          content: <div>교배는 기본적으로 두 마리의 포켓몬이 필요해. 교배 대상의 두 포켓몬은 <span className='c-lightblue'>레벨이 1씩 하락</span>하거나, 레벨 1의 포켓몬은 슬프지만 <span className='c-lightblue'>영원히 사라져.</span></div>,
          onClickContinue: () => {
            setTutorialModal({
              show: true,
              content: <div>하지만 운이 좋으면 보다 강하고 희귀한 <span className='c-lightblue'>RARE 등급의 포켓몬</span>을 얻을 수 있어. 그럼 어디 한번 해볼까? 대상 포켓몬을 선택하고 교배를 진행해보자.</div>,
              onClickContinue: () => setTutorialModal({ show: false })
            })
          }
        })
      }
    }
    // 교배시 두번째 대상 포켓몬까지 선택한 경우
    if (this.props.pickMonInfo && this.props.pickMonInfo.mixCols &&
      this.props.pickMonInfo.mixCols.length === 2 && prevProps.pickMonInfo.mixCols.length === 1) {
      const { updatePickMonInfo, pickMonInfo, locale, messages } = this.props
      const { mixCols } = pickMonInfo
      const asisMixCols = prevProps.pickMonInfo.mixCols
      let title = getMsg(messages.collectionView.mixAlertTitle, locale)
      title = title.replace('{name1}', `<span class='c-lightblue f-700'>${getMsg(mixCols[0].mon[mixCols[0].monId].name, locale)}</span>`)
      title = title.replace('{name2}', `<span class='c-lightblue f-700'>${getMsg(mixCols[1].mon[mixCols[1].monId].name, locale)}</span>`)
      showAlert({
        title,
        text: '교배하는 포켓몬의 레벨이 1 하락하고, 레벨 1의 포켓몬의 경우 영원히 사라집니다.',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      })
      .then(() => {
        this.context.router.push(`/pick-mon`)
      })
      .catch(() => {
        updatePickMonInfo(Object.assign({}, pickMonInfo, { mixCols: asisMixCols }))
      })
    }
  }
  componentWillUnmount () {
    const { pickMonInfo, updatePickMonInfo, firebase, params } = this.props
    if (pickMonInfo && pickMonInfo.mixCols && pickMonInfo.mixCols.length === 1) updatePickMonInfo(null)
    if (!this._isMine()) {
      firebase.unWatchEvent('value', `userCollections/${params.userId}`)
    }
  }
  _initCollectionState () {
    const { params, firebase, mons, userCollections, auth, user, filter } = this.props
    const { userId } = params
    const collections = []
    const quantity = {
      b: { has: 0, total: 0 },
      r: { has: 0, total: 0 },
      s: { has: 0, total: 0 },
      sr: { has: 0, total: 0 },
      e: { has: 0, total: 0 },
      l: { has: 0, total: 0 }
    }
    let getCollectionToView
    if (auth && userId === auth.uid) getCollectionToView = () => Promise.resolve(userCollections)
    else getCollectionToView = () => getCollectionsByUserId(firebase, userId)
    return getCollectionToView()
    .then(cols => {
      if (!cols) return
      let defenders
      mons.forEach(mon => {
        const monId = mon.id
        const has = cols.filter(col => col.monId === monId)[0]
        defenders = cols.filter(col => col.isDefender)
        if (has) {
          quantity[mon.grade].has++
          quantity[mon.grade].total++
          collections.push(has)
        } else {
          quantity[mon.grade].total++
          collections.push(mon)
        }
      })
      const orederdCollections = _.orderBy(collections, (e) => { return e.no || e.mon[e.monId].no }, ['asc'])
      this.setState({ collections: orederdCollections, filteredCollections: orederdCollections, quantity, defenders })
      return Promise.resolve()
    })
    .then(() => {
      let getUserToView
      if (auth && userId === auth.uid) getUserToView = () => Promise.resolve(user)
      else getUserToView = () => getUserRankingByUserId(firebase, 'collection', userId).then(() => getUserRankingByUserId(firebase, 'battle', userId)).then(() => getUserByUserId(firebase, userId))
      return getUserToView() // 랭킹 업데이트 후 유저정보가져옴
    })
    .then(userToView => {
      this._applyFilter(filter)
      this.setState({ userToView })
    })
  }
  _handleOnClickFilter () {
    this.setState({ showFilterModal: true })
  }
  _handleOnClickApplyFilter () {
    const { filter } = this.props
    this._applyFilter(filter)
  }
  _applyFilter (filter, colId, shouldRefreshElements) { // 두번째 파라미터는 옵션 (교배시 교배대상 첫번째 포켓몬 제외용), 세번째 파라메터는 교배취소 시 차트와 콜렉션 리프레시용. 없으면 렌더링이 안됨
    const { collections } = this.state
    if (!collections) return
    const filteredCollections = collections.filter(col => {
      const mon = col.mon ? col.mon[col.monId] : col
      return filter.has[col.mon ? 'yes' : 'no'] &&
        filter.isEvolutable[(col.mon && col.mon[col.monId].evoLv !== 0 && (col.level >= col.mon[col.monId].evoLv)) ? 'yes' : 'no'] &&
        filter.grade[mon.grade] && filter.mainAttr[mon.mainAttr] &&
        filter.subAttr[!mon.subAttr ? '없음' : mon.subAttr] && filter.cost[mon.cost] && filter.generation[mon.generation] && (colId ? col.id !== colId : true)
    })
    this.setState({ showFilterModal: false, filteredCollections })
    if (shouldRefreshElements) {
      this.setState({ pieChartKey: keygen._(), collectionsKey: keygen._() })
    }
  }
  _handleOnClickApplyDefender (defenders) { // defenders.asis, defenders.tobe
    // TODO: 총 전투력 제한 및 코스트 체크로직 들어가야함
    this.setState({ isLoading: true })
    const { firebase } = this.props
    const asisProms = []
    const tobeProms = []
    defenders.asis.forEach(defender => {
      tobeProms.push(updateIsDefender(firebase, defender, false))
    })
    defenders.tobe.forEach(defender => {
      tobeProms.push(updateIsDefender(firebase, defender, true))
    })
    Promise.all(asisProms)
    .then(() => {
      return Promise.all(tobeProms)
    })
    .then(() => {
      this.setState({ defenders: defenders.tobe, isLoading: false, showDefenderModal: false })
      this._initCollectionState()
      toast('새로운 수비 포켓몬이 적용되었습니다.')
    })
  }
  _handleOnChangeFilterInput (e) {
    const { filter, receiveFilter } = this.props
    const { name } = e.target
    const filterCategory = name.split('-')[0]
    const filterElement = name.split('-')[1]
    const oldFilter = fromJS(filter)
    let newCategoryFilterMap = null
    const category = oldFilter.get(filterCategory)
    if (filterElement === 'all') {
      const isAllTrue = obj => {
        let result = true
        const keys = Object.keys(obj)
        for (let key of keys) {
          if (!obj[key]) {
            result = false
            break
          }
        }
        return result
      }
      const tobeVal = !isAllTrue(filter[filterCategory])
      const keys = category.keySeq().toArray()
      keys.forEach(key => {
        newCategoryFilterMap = newCategoryFilterMap
        ? newCategoryFilterMap.update(key, val => tobeVal) : category.update(key, val => tobeVal)
      })
    } else newCategoryFilterMap = category.update(filterElement, val => !val)
    const newFilter = oldFilter.set(filterCategory, newCategoryFilterMap).toJS()
    receiveFilter(newFilter)
  }
  _initMixMode () {
    const { pickMonInfo, receiveFilter } = this.props
    const filter = Object.assign({}, this.props.filter, { has: { yes: true, no: false } })
    receiveFilter(filter)
    this.setState({
      isInitializedMixMode: true
    })
    this._applyFilter(filter, pickMonInfo.mixCols[0].id)
  }
  _handleOnSelectMon (col) {
    // 교배 후 상대 포켓몬 선택시
    const { pickMonInfo, updatePickMonInfo } = this.props
    if (col.id === pickMonInfo.mixCols[0].id) {
      showAlert('같은 포켓몬은 선택할 수 없습니다.')
      return false
    } else if (col.isDefender && col.level === 1) {
      showAlert({ title: '이런!', text: 'LV.1의 수비 포켓몬은 교배할 수 없습니다.', type: 'error' })
      return false
    } else if (col.isFavorite && col.level === 1) {
      showAlert({ title: '이런!', text: 'LV.1의 즐겨찾기 포켓몬은 교배할 수 없습니다.', type: 'error' })
      return false
    }
    const asisMixCols = pickMonInfo.mixCols
    const mixCols = _.concat(asisMixCols, col)
    const newPickMonInfo = Object.assign({}, pickMonInfo, { mixCols })
    updatePickMonInfo(newPickMonInfo)
  }
  _cancelMix () {
    const { receiveFilter } = this.props
    this.props.updatePickMonInfo(null)
    const filter = Object.assign({}, this.state.filter, { has: { yes: true, no: true } })
    receiveFilter(filter)
    this.setState({
      mode: 'view',
      isInitializedMixMode: false
    })
    this._applyFilter(filter, null, true)
  }
  _handleOnClickCollapse (key) {
    const { filterCollapse } = this.state
    this.setState({ filterCollapse: Object.assign({}, filterCollapse, { [key]: !filterCollapse[key] }) })
  }
  _handleOnClickTrainerInfo () {
    const { userId } = this.props.params
    const { showUserModal, auth } = this.props
    const { userToView } = this.state
    showUserModal({ user: userToView, isMyself: auth.uid === userId, isLoading: false })
  }
  _handleOnClickShield (col) {
    this.setState({ showDefenderModal: true, currentCol: col })
  }
  _isMine () {
    const { auth, params } = this.props
    const { userId } = params
    return auth && userId === auth.uid
  }
  render () {
    const { filteredCollections, filterCollapse, openFloatMenu, mode, userToView, defenders } = this.state
    const { filter, pickMonInfo, auth, params, user, locale } = this.props
    const { userId } = params
    const isMine = auth && userId === auth.uid
    const renderCollections = () => {
      const { collectionsKey } = this.state
      if (filteredCollections.length === 0) {
        return <div className='text-center'><WarningText text='조건에 맞는 포켓몬이 없습니다.' /></div>
      }
      const collectionsArr = filteredCollections.map((col, idx) => {
        const isMineAndHave = isMine && col.userId
        return <MonCard blinkMix={user && user.isTutorialOn && user.tutorialStep === 5 && isMineAndHave} isSelectable={this.state.mode === 'mix'} onSelect={() => this._handleOnSelectMon(col)}
          onUnselect={() => { }} isNotMine={!isMine} showStatusBadge={isMineAndHave && mode === 'view'} user={userToView}
          key={col.id} mon={{ asis: null, tobe: col }} type={col.mon ? 'collection' : 'mon'} onClickShield={() => this._handleOnClickShield(col)} />
      })
      return <div key={collectionsKey}>{collectionsArr}</div>
    }
    const renderFilterBody = () => {
      const grades = {
        names: ['전체', 'BASIC', 'SPECIAL', 'RARE', 'S.RARE', 'ELITE', 'LEGEND'],
        values: ['all', 'b', 's', 'r', 'sr', 'e', 'l']
      }
      const attrObj = {
        names: ['전체', ...attrs],
        values: ['all', ...attrs]
      }
      const subAttrObj = {
        names: ['전체', ...attrs, '없음'],
        values: ['all', ...attrs, '없음']
      }
      const costObj = {
        names: ['전체', '1코스트', '2코스트', '3코스트', '4코스트', '5코스트', '6코스트', '7코스트', '8코스트', '9코스트', '10코스트'],
        values: ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      }
      const genObj = {
        names: ['전체', '1세대', '2세대', '3세대', '4세대', '5세대', '6세대', '7세대'],
        values: ['all', '1', '2', '3', '4', '5', '6', '7']
      }
      const isAllTrue = obj => {
        let result = true
        const keys = Object.keys(obj)
        for (let key of keys) {
          if (!obj[key]) {
            result = false
            break
          }
        }
        return result
      }
      return (
        <div className='panel-group'>
          { mode !== 'mix' &&
            <div className='panel panel-collapse'>
              <div className={`panel-heading${filterCollapse.has ? ' active' : ''}`}>
                <h4 className='panel-title'>
                  <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('has')}>
                  보유여부
                  </a>
                </h4>
              </div>
              <Collapse in={filterCollapse.has}>
                <div className='panel-body'>
                  <Checkbox label='전체' name='has-all'
                    checked={filter.has.yes && filter.has.no} onChange={this._handleOnChangeFilterInput} />
                  <Checkbox label='보유' checked={filter.has.yes} name='has-yes' onChange={this._handleOnChangeFilterInput} />
                  <Checkbox label='미보유' checked={filter.has.no} name='has-no' onChange={this._handleOnChangeFilterInput} />
                </div>
              </Collapse>
            </div>
          }
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.grade ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('grade')}>
                등급
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.grade}>
              <div className='panel-body'>
                {grades.names.map((name, idx) => <Checkbox label={name} checked={grades.values[idx] === 'all' ? isAllTrue(filter.grade) : filter.grade[grades.values[idx]]} name={`grade-${grades.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
              </div>
            </Collapse>
          </div>
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.mainAttr ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('mainAttr')}>
                  주속성
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.mainAttr}>
              <div className='panel-body'>
                {attrObj.names.map((name, idx) => <Checkbox label={name} checked={attrObj.values[idx] === 'all' ? isAllTrue(filter.mainAttr) : filter.mainAttr[attrObj.values[idx]]} name={`mainAttr-${attrObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
              </div>
            </Collapse>
          </div>
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.subAttr ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('subAttr')}>
                  부속성
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.subAttr}>
              <div className='panel-body'>
                {subAttrObj.names.map((name, idx) => <Checkbox label={name} checked={subAttrObj.values[idx] === 'all' ? isAllTrue(filter.subAttr) : filter.subAttr[subAttrObj.values[idx]]} name={`subAttr-${subAttrObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
              </div>
            </Collapse>
          </div>
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.cost ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('cost')}>
                  코스트
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.cost}>
              <div className='panel-body'>
                {costObj.names.map((name, idx) => <Checkbox label={name} checked={costObj.values[idx] === 'all' ? isAllTrue(filter.cost) : filter.cost[costObj.values[idx]]} name={`cost-${costObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
              </div>
            </Collapse>
          </div>
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.generation ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('generation')}>
                  세대
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.generation}>
              <div className='panel-body'>
                {genObj.names.map((name, idx) => <Checkbox label={name} checked={genObj.values[idx] === 'all' ? isAllTrue(filter.generation) : filter.generation[genObj.values[idx]]} name={`generation-${genObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
              </div>
            </Collapse>
          </div>
          <div className='panel panel-collapse m-t-20'>
            <div className={`panel-heading${filterCollapse.isEvolutable ? ' active' : ''}`}>
              <h4 className='panel-title'>
                <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickCollapse('isEvolutable')}>
                  진화가능여부
                </a>
              </h4>
            </div>
            <Collapse in={filterCollapse.isEvolutable}>
              <div className='panel-body'>
                <Checkbox label='전체' name='isEvolutable-all'
                  checked={filter.isEvolutable.yes && filter.isEvolutable.no} onChange={this._handleOnChangeFilterInput} />
                <Checkbox label='가능' checked={filter.isEvolutable.yes} name='isEvolutable-yes' onChange={this._handleOnChangeFilterInput} />
                <Checkbox label='불가능' checked={filter.isEvolutable.no} name='isEvolutable-no' onChange={this._handleOnChangeFilterInput} />
              </div>
            </Collapse>
          </div>
        </div>
      )
    }
    const renderFilterFooter = () => {
      return (
        <div className='text-right'>
          <Button link text='닫기' onClick={() => this.setState({ showFilterModal: false })} />
          <Button text='적용하기' icon='fa fa-check'
            onClick={this._handleOnClickApplyFilter} />
        </div>
      )
    }
    const renderBody = () => {
      if (!userToView || !filteredCollections) return <Loading text='콜렉션을 불러오는 중...' height={window.innerHeight - 280} />
      else {
        return (
          <div className='row'>
            <FloatingButton iconClassName='zmdi zmdi-plus'
              rotateIcon={openFloatMenu}
              onClick={() => this.setState({ openFloatMenu: !openFloatMenu })}
              tooltipText={openFloatMenu ? '메뉴닫기' : '메뉴열기'}
            />
            <FloatingButton iconClassName='zmdi zmdi-filter-list'
              onClick={this._handleOnClickFilter}
              bottom={60}
              backgroundColor={colors.orange}
              hidden={!openFloatMenu}
              tooltipText='필터'
            />
            <FloatingButton iconClassName='zmdi zmdi-account'
              onClick={this._handleOnClickTrainerInfo}
              bottom={120}
              backgroundColor={colors.orange}
              hidden={!openFloatMenu}
              tooltipText='트레이너프로필'
            />
            {renderCollections()}
            <CustomModal
              title='콜렉션 필터'
              bodyComponent={renderFilterBody()}
              footerComponent={renderFilterFooter()}
              show={this.state.showFilterModal}
              close={() => this.setState({ showFilterModal: false })}
              backdrop
            />
            {
              this.state.defenders &&
              <DefenderModal
                defenders={defenders}
                show={this.state.showDefenderModal}
                close={() => this.setState({ showDefenderModal: false })}
                onClickApply={this._handleOnClickApplyDefender}
                currentCol={this.state.currentCol}
                isLoading={this.state.isLoading}
                user={userToView}
              />
            }
          </div>
        )
      }
    }
    const renderCharts = () => {
      const { quantity, pieChartKey } = this.state
      if (!quantity) return null
      const grades = Object.keys(quantity)
      const pieChartArr = grades.map((grade, idx) => {
        const barColor = grade === 'b' ? colors.amber : grade === 'r' ? colors.green : grade === 's' ? colors.lightBlue : grade === 'sr' ? colors.deepPurple : grade === 'e' ? colors.pink : grade === 'l' ? colors.orange : ''
        return (
          <PieChart sub={quantity[grade].has} total={quantity[grade].total} key={idx} trackColor={colors.lightGray} barColor={barColor}
            label={grade === 'b' ? 'BASIC' : grade === 'r' ? 'RARE' : grade === 's' ? 'SPECIAL' : grade === 'sr' ? 'S.RARE' : grade === 'e' ? 'ELITE' : grade === 'l' ? 'LEGEND' : ''}
          />
        )
      })
      return <div key={pieChartKey}>{pieChartArr}</div>
    }
    const renderHeader = () => {
      if (mode === 'mix') {
        return (<div>
          <h2 style={{ paddingRight: '60px' }}><span className='c-lightblue f-700'>{getMsg(pickMonInfo.mixCols[0].mon[pickMonInfo.mixCols[0].monId].name, locale)}</span>와(과) 교배할 포켓몬을 선택해주세요.</h2>
          <ul className='actions' style={{ right: '20px' }}>
            <li><Button icon='zmdi zmdi-close' text='취소' color='deeporange' onClick={this._cancelMix} /></li>
          </ul>
        </div>)
      }
      return (
        <div className='row'>
          {renderCharts()}
        </div>
      )
    }
    return (
      <ContentContainer
        key={this.props.params.userId}
        header={renderHeader()}
        stickyHeader={mode === 'mix'}
        title={userToView ? `${this.props.auth && this.props.auth.uid === this.props.params.userId ? '내' : `${userToView.nickname}님의`} 콜렉션` : ''}
        body={renderBody()}
      />
    )
  }
}

CollectionView.contextTypes = {
  router: PropTypes.object.isRequired
}

CollectionView.propTypes = {
  params: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  mons: PropTypes.array,
  updatePickMonInfo: PropTypes.func.isRequired,
  pickMonInfo: PropTypes.object,
  showUserModal: PropTypes.func.isRequired,
  userModal: PropTypes.object.isRequired,
  userCollections: PropTypes.array,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  setTutorialModal: PropTypes.func.isRequried,
  receiveFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired
}

export default CollectionView
