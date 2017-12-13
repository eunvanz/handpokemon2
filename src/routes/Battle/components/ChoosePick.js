import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import { Collapse } from 'react-bootstrap'
import { fromJS } from 'immutable'
import numeral from 'numeral'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import MonCard from 'components/MonCard'
import CustomModal from 'components/CustomModal'
import FloatingButton from 'components/FloatingButton'
import Checkbox from 'components/Checkbox'

import { LEAGUE } from 'constants/rules'
import { colors } from 'constants/colors'
import { attrs } from 'constants/data'

import { getHonorBurf, getHonorBurfTotal } from 'utils/commonUtil'

class ChoosePick extends React.Component {
  constructor (props) {
    super(props)
    const { user } = props
    const { isAdventure } = props
    this.state = {
      currentCost: 0,
      maxCost: isAdventure ? props.maxCost : LEAGUE[user.league].maxCost,
      sortedCollections: [],
      chosenPick: [],
      filter: {
        grade: {
          b: true,
          r: true,
          s: true,
          sr: true,
          e: true,
          l: true
        },
        mainAttr: {
          '노말': true,
          '불꽃': true,
          '물': true,
          '전기': true,
          '풀': true,
          '얼음': true,
          '비행': true,
          '요정': true,
          '땅': true,
          '독': true,
          '격투': true,
          '염력': true,
          '벌레': true,
          '바위': true,
          '유령': true,
          '용': true,
          '악': true,
          '강철': true
        },
        subAttr: {
          '노말': true,
          '불꽃': true,
          '물': true,
          '전기': true,
          '풀': true,
          '얼음': true,
          '비행': true,
          '요정': true,
          '땅': true,
          '독': true,
          '격투': true,
          '염력': true,
          '벌레': true,
          '바위': true,
          '유령': true,
          '용': true,
          '악': true,
          '강철': true,
          '없음': true
        },
        cost: {
          '1': true,
          '2': true,
          '3': true,
          '4': true,
          '5': true,
          '6': true,
          '7': true,
          '8': true,
          '9': true,
          '10': true
        },
        generation: {
          '1': true,
          '2': true,
          '3': true,
          '4': true,
          '5': true,
          '6': true,
          '7': true
        }
      },
      filterCollapse: {
        has: false,
        grade: false,
        mainAttr: false,
        subAttr: false,
        cost: false,
        generation: false,
        isEvolutable: false
      },
      showFilterModal: false,
      isLoading: false
    }
    this._filterByAvailableCost = this._filterByAvailableCost.bind(this)
    this._handleOnSelectMon = this._handleOnSelectMon.bind(this)
    this._findColInChosenPick = this._findColInChosenPick.bind(this)
    this._handleOnUnselectMon = this._handleOnUnselectMon.bind(this)
    this._applyFilter = this._applyFilter.bind(this)
    this._handleOnChangeFilterInput = this._handleOnChangeFilterInput.bind(this)
    this._handleOnClickCollapse = this._handleOnClickCollapse.bind(this)
    this._handleOnClickApplyFilter = this._handleOnClickApplyFilter.bind(this)
    this._handleOnClickNext = this._handleOnClickNext.bind(this)
  }
  componentDidMount () {
    this._filterByAvailableCost(0, [])
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _applyFilter (collections) { // 두번째 파라미터는 옵션 (교배시 교배대상 첫번째 포켓몬 제외용), 세번째 파라메터는 교배취소 시 차트와 콜렉션 리프레시용. 없으면 렌더링이 안됨
    const { filter, chosenPick } = this.state
    const filteredCollections = collections.filter(col => {
      const mon = col.mon ? col.mon[col.monId] : col
      return (filter.grade[mon.grade] && filter.mainAttr[mon.mainAttr] &&
        filter.subAttr[!mon.subAttr ? '없음' : mon.subAttr] && filter.cost[mon.cost] && filter.generation[mon.generation]) ||
        _.find(chosenPick, p => p.id === col.id)
    })
    return filteredCollections
  }
  _handleOnClickApplyFilter () {
    const { sortedCollections } = this.state
    const filteredCollections = this._applyFilter(sortedCollections)
    this.setState({ showFilterModal: false, sortedCollections: filteredCollections })
  }
  _handleOnSelectMon (col) {
    const { currentCost, chosenPick, maxCost } = this.state
    const newCost = currentCost + col.mon[col.monId].cost
    if (newCost > maxCost) {
      return window.swal({ text: '최대 코스트 초과입니다.' })
    }
    const newPick = chosenPick.slice()
    newPick.push(col)
    this.setState({ currentCost: newCost, chosenPick: newPick })
    this._filterByAvailableCost(newCost, newPick)
  }
  _handleOnUnselectMon (col) {
    const { currentCost, chosenPick } = this.state
    const newCost = currentCost - col.mon[col.monId].cost
    const newPick = _.remove(chosenPick, c => c.id !== col.id)
    this.setState({ currentCost: newCost, chosenPick: newPick })
    this._filterByAvailableCost(newCost, newPick)
  }
  _filterByAvailableCost (cost, pick) {
    if (pick.length === 3) return this.setState({ sortedCollections: pick })
    const { collections } = this.props
    const { maxCost } = this.state
    const adjustCollections = collections.map(col => Object.assign({}, col, { totalIdx: col.total + col.addedTotal }, { isChosen: _.find(pick, p => col.id === p.id) != undefined }))
    const originCollections = _.orderBy(adjustCollections.filter(c => !c.isDefender), ['isChosen', 'isFavorite', 'totalIdx'], ['desc', 'desc', 'desc'])
    const restPick = 2 - pick.length
    const availableCost = maxCost - cost - restPick
    const filteredCollections = originCollections.filter(c => (c.mon[c.monId].cost <= availableCost) ||
      _.find(pick, p => p.id === c.id))
    this.setState({ sortedCollections: this._applyFilter(filteredCollections) })
  }
  _findColInChosenPick (col) {
    const { chosenPick } = this.state
    return _.find(chosenPick, p => p.id === col.id)
  }
  _handleOnClickNext () {
    this.setState({ isLoading: true })
    const { onClickNext } = this.props
    const { chosenPick } = this.state
    if (chosenPick.length !== 3) {
      this.setState({ isLoading: false })
      return window.swal({ text: '3마리의 포켓몬을 선택해주세요.' })
    }
    onClickNext(chosenPick)
    .catch(msg => {
      this.setState({ isLoading: false })
    })
  }
  _handleOnChangeFilterInput (e) {
    const { filter } = this.state
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
    this.setState({ filter: newFilter })
  }
  _handleOnClickCollapse (key) {
    const { filterCollapse } = this.state
    this.setState({ filterCollapse: Object.assign({}, filterCollapse, { [key]: !filterCollapse[key] }) })
  }
  render () {
    const { user, messages, locale } = this.props
    const { currentCost, maxCost, sortedCollections, chosenPick, filterCollapse, filter, isLoading } = this.state
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
      return (
        <div className='row'>
          {
            sortedCollections.map((col, idx) => {
              return (
                <MonCard isSelectable isNotMine onSelect={() => this._handleOnSelectMon(col)}
                  onUnselect={() => this._handleOnUnselectMon(col)} user={user}
                  isSelected={this._findColInChosenPick(col) != null}
                  key={col.id} mon={{ asis: null, tobe: col }} type='collection'
                  locale={locale} messages={messages}
                />
              )
            })
          }
          <CustomModal
            title='콜렉션 필터'
            bodyComponent={renderFilterBody()}
            footerComponent={renderFilterFooter()}
            show={this.state.showFilterModal}
            close={() => this.setState({ showFilterModal: false })}
            backdrop
          />
          <FloatingButton iconClassName='zmdi zmdi-filter-list'
            onClick={() => this.setState({ showFilterModal: true })}
            backgroundColor={colors.orange}
            tooltipText='필터'
          />
        </div>
      )
    }
    const renderHeader = () => {
      return (
        <div>
          <h2 style={{ paddingRight: '60px' }}>총 전투력: <span className='c-lightblue f-700'>{chosenPick ? numeral(chosenPick.reduce((accm, p) => accm + p.total + p.addedTotal, 0) + getHonorBurfTotal(getHonorBurf(user)) * chosenPick.length).format('0,0') : 0}</span> (코스트: <span className='c-lightblue f-700'>{currentCost}</span> / {maxCost})</h2>
          <ul className='actions' style={{ right: '20px' }}>
            <li><Button loading={isLoading} icon='fa fa-check' text='선택완료' color='green' disabled={chosenPick.length !== 3} onClick={this._handleOnClickNext} /></li>
          </ul>
        </div>
      )
    }
    return (
      <ContentContainer
        title='출전 포켓몬 선택'
        body={renderBody()}
        header={renderHeader()}
        stickyHeader
      />
    )
  }
}

ChoosePick.contextTypes = {
  router: PropTypes.object.isRequired
}

ChoosePick.propTypes = {
  collections: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onClickNext: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  isAdventure: PropTypes.bool,
  maxCost: PropTypes.number
}

export default ChoosePick