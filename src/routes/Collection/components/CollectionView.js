import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import FloatingButton from 'components/FloatingButton'
import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import WarningText from 'components/WarningText'

import { getCollectionsByUserId } from 'services/CollectionService'

import { attrs } from 'constants/data'
import { colors } from 'constants/colors'

class CollectionView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collections: null,
      filteredCollections: null,
      isMixMode: false,
      openFloatMenu: false,
      showFilterModal: false,
      filter: {
        has: {
          yes: true,
          no: true
        },
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
      }
    }
    this._handleOnClickApplyFilter = this._handleOnClickApplyFilter.bind(this)
    this._handleOnClickFilter = this._handleOnClickFilter.bind(this)
    this._handleOnChangeFilterInput = this._handleOnChangeFilterInput.bind(this)
    this._initCollectionState = this._initCollectionState.bind(this)
  }
  componentDidMount () {
    this._initCollectionState()
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('this.props.mons', this.props.mons)
    if (!fromJS(prevProps.mons).equals(fromJS(this.props.mons))) {
      console.log('mons are not equal')
      this._initCollectionState()
    }
  }
  _initCollectionState () {
    console.log('initCollectionState')
    const { params, firebase, mons } = this.props
    const { userId } = params
    const collections = []
    getCollectionsByUserId(firebase, userId)
    .then(cols => {
      mons.forEach(mon => {
        const monId = mon.id
        const has = cols.filter(col => col.monId === monId)[0]
        if (has) collections.push(has)
        else {
          collections.push(mon)
        }
      })
      const orederdCollections = _.orderBy(collections, (e) => { return e.no || e.mon[e.monId].no }, ['asc'])
      this.setState({ collections: orederdCollections, filteredCollections: orederdCollections })
    })
  }
  _handleOnClickFilter () {
    this.setState({ showFilterModal: true })
  }
  _handleOnClickApplyFilter () {
    const { collections, filter } = this.state
    const filteredCollections = collections.filter(col => {
      const mon = col.mon ? col.mon[col.monId] : col
      return filter.has[col.mon ? 'yes' : 'no'] &&
        filter.grade[mon.grade] && filter.mainAttr[mon.mainAttr] &&
        filter.subAttr[!mon.subAttr ? '없음' : mon.subAttr] && filter.cost[mon.cost] && filter.generation[mon.generation]
    })
    this.setState({ showFilterModal: false, filteredCollections })
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
  render () {
    const { collections, filter, filteredCollections, openFloatMenu } = this.state
    const renderCollections = () => {
      if (filteredCollections.length === 0) {
        return <div className='text-center'><WarningText text='조건에 맞는 포켓몬이 없습니다.' /></div>
      }
      return filteredCollections.map((col, idx) => {
        return <MonCard key={idx} mon={{ asis: null, tobe: col }} type={col.mon ? 'collection' : 'mon'} />
      })
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
        <div>
          <h4 className='m-t-20'>보유여부</h4>
          <Checkbox label='전체' name='has-all'
            checked={filter.has.yes && filter.has.no} onChange={this._handleOnChangeFilterInput} />
          <Checkbox label='보유' checked={filter.has.yes} name='has-yes' onChange={this._handleOnChangeFilterInput} />
          <Checkbox label='미보유' checked={filter.has.no} name='has-no' onChange={this._handleOnChangeFilterInput} />
          <h4 className='m-t-20'>등급</h4>
          {grades.names.map((name, idx) => <Checkbox label={name} checked={grades.values[idx] === 'all' ? isAllTrue(filter.grade) : filter.grade[grades.values[idx]]} name={`grade-${grades.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
          <h4 className='m-t-20'>주속성</h4>
          {attrObj.names.map((name, idx) => <Checkbox label={name} checked={attrObj.values[idx] === 'all' ? isAllTrue(filter.mainAttr) : filter.mainAttr[attrObj.values[idx]]} name={`mainAttr-${attrObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
          <h4 className='m-t-20'>부속성</h4>
          {subAttrObj.names.map((name, idx) => <Checkbox label={name} checked={subAttrObj.values[idx] === 'all' ? isAllTrue(filter.subAttr) : filter.subAttr[subAttrObj.values[idx]]} name={`subAttr-${subAttrObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
          <h4 className='m-t-20'>코스트</h4>
          {costObj.names.map((name, idx) => <Checkbox label={name} checked={costObj.values[idx] === 'all' ? isAllTrue(filter.cost) : filter.cost[costObj.values[idx]]} name={`cost-${costObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
          <h4 className='m-t-20'>세대</h4>
          {genObj.names.map((name, idx) => <Checkbox label={name} checked={genObj.values[idx] === 'all' ? isAllTrue(filter.generation) : filter.generation[genObj.values[idx]]} name={`generation-${genObj.values[idx]}`} onChange={this._handleOnChangeFilterInput} key={idx} />)}
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
      if (!collections) return <Loading text='콜렉션을 불러오는 중...' height={window.innerHeight} />
      else {
        return (
          <div className='row'>
            <FloatingButton iconClassName={openFloatMenu ? 'fa fa-times' : 'fa fa-plus'}
              onClick={() => this.setState({ openFloatMenu: !openFloatMenu })}
              tooltipText={openFloatMenu ? '메뉴닫기' : '메뉴열기'}
            />
            <FloatingButton iconClassName='fa fa-filter'
              onClick={this._handleOnClickFilter}
              bottom={100}
              backgroundColor={colors.amber}
              hidden={!openFloatMenu}
              tooltipText='필터'
            />
            <FloatingButton iconClassName='fa fa-flask'
              onClick={this._handleOnClickFilter}
              bottom={160}
              backgroundColor={colors.amber}
              hidden={!openFloatMenu}
              tooltipText='교배하기'
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
          </div>
        )
      }
    }
    return (
      <ContentContainer
        title='내 콜렉션'
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
  mons: PropTypes.array
}

export default CollectionView
