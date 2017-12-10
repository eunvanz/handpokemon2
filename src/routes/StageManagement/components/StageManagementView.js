import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import LabelInput from 'components/LabelInput'
import Selectbox from 'components/Selectbox'
import Button from 'components/Button'
import MonCard from 'components/MonCard'

import { getStagePick } from 'services/MonService'
import { postStage, deleteStage, updateStage } from 'services/StageService'

import Stage from 'models/stage'

class StageManagementView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gradesNo: '1',
      quantity: 1,
      minAbility: props.stages.length > 0 ? props.stages[props.stages.length - 1].total : 700,
      maxCost: 7,
      picks: [],
      showStageForm: false,
      editMode: 'write' // write, update
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickGeneratePick = this._handleOnClickGeneratePick.bind(this)
    this._handleOnClickWrite = this._handleOnClickWrite.bind(this)
    this._handleOnClickSave = this._handleOnClickSave.bind(this)
    this._handleOnClickItem = this._handleOnClickItem.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickWrite () {
    this.setState({ editMode: 'write', showStageForm: true })
    this._initFormData()
  }
  _handleOnClickGeneratePick () {
    const { firebase } = this.props
    const { minAbility } = this.state
    getStagePick(firebase, minAbility)
    .then(picks => {
      this.setState({ picks })
    })
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    this.setState({ [id]: value })
  }
  _initFormData () {
    this.setState({
      gradesNo: '1',
      quantity: 1,
      minAbility: this.props.stages.length > 0 ? this.props.stages[0].total : 700,
      maxCost: 7,
      picks: [],
      editMode: 'write' // write, update
    })
  }
  _handleOnClickSave () {
    const { firebase, stages } = this.props
    const { gradesNo, quantity, minAbility, maxCost, picks, editMode, id } = this.state
    let grades
    if (gradesNo === '1') grades = ['b', 'r']
    else if (gradesNo === '2') grades = ['s']
    else if (gradesNo === '3') grades = ['r']
    else if (gradesNo === '4') grades = ['sr']
    else if (gradesNo === '5') grades = ['e']
    else if (gradesNo === '6') grades = ['l']
    const stage = Object.assign({}, new Stage(), { no: stages.length + 1, gradesNo, grades, quantity, minAbility, maxCost, picks, total: picks.reduce((accm, pick) => accm + pick.total + pick.addedTotal, 0) })
    if (editMode === 'write') postStage(firebase, stage)
    else if (editMode === 'update') updateStage(firebase, id, Object.assign({}, stage, { no: stages.filter(stage => stage.id === id)[0].no }))
  }
  _handleOnClickItem (id) {
    const { stages } = this.props
    const stage = stages.filter(stage => id === stage.id)[0]
    this.setState({
      id: stage.id,
      no: stage.no,
      gradesNo: stage.gradesNo,
      quantity: stage.quantity,
      minAbility: stage.minAbility,
      maxCost: stage.maxCost,
      picks: stage.picks,
      editMode: 'update',
      showStageForm: true
    })
  }
  _handleOnClickDelete () {
    const { id } = this.state
    const { firebase } = this.props
    deleteStage(firebase, id)
    .then(() => {
      this._initFormData()
    })
  }
  render () {
    const { picks } = this.state
    const renderElements = () => {
      if (this.props.stages) {
        return this.props.stages.map((stage, idx) => {
          return (
            <div className='list-group-item media' key={idx}>
              <div className='media-body'>
                <div className='lgi-heading' style={{ cursor: 'pointer' }}
                  onClick={() => this._handleOnClickItem(stage.id)}>{stage.no}. {stage.grades}. {stage.total}. {stage.maxCost} </div>
              </div>
            </div>
          )
        })
      } else {
        return <div className='text-center'>스테이지가 없습니다.</div>
      }
    }
    const renderList = () => {
      return (
        <div className='list-group lg-odd-black'>
          <div className='action-header clearfix'>
            <div className='ah-label hidden-xs'>스테이지 리스트</div>
            <ul className='actions'>
              <li>
                <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickWrite}>
                  <i className='fa fa-pencil' />
                </a>
              </li>
            </ul>
          </div>
          {renderElements()}
        </div>
      )
    }
    const renderForm = () => {
      return (
        <div className='container'>
          <div className='row'>
            <div className='col-sm-3'>
              <Selectbox
                id='gradesNo'
                defaultValue='타입선택'
                options={[
                  { name: '일반', value: '1' },
                  { name: '스페셜', value: '2' },
                  { name: '레어', value: '3' },
                  { name: '스페셜레어', value: '4' },
                  { name: '엘리트', value: '5' },
                  { name: '레전드', value: '6' }
                ]}
                onChange={this._handleOnChangeInput}
                value={this.state.gradesNo}
              />
            </div>
            <div className='col-sm-3'>
              <LabelInput
                label='수량'
                id='quantity'
                type='number'
                onChange={this._handleOnChangeInput}
                name='quantity'
                value={this.state.quantity}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-3'>
              <LabelInput
                label='기준 전투력'
                id='minAbility'
                type='number'
                onChange={this._handleOnChangeInput}
                name='minAbility'
                value={this.state.minAbility}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-3'>
              <LabelInput
                label='코스트 제한'
                id='maxCost'
                type='number'
                onChange={this._handleOnChangeInput}
                name='maxCost'
                value={this.state.maxCost}
                floating
                length={12}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-3 col-sm-1' />
            {picks.map((pick, idx) => <MonCard key={idx} mon={{ asis: null, tobe: pick }} type='collection' />)}
          </div>
          <div className='row'>
            <div className='col-xs-12 text-center'>
              총 전투력: {picks.reduce((accm, pick) => accm + pick.total + pick.addedTotal, 0)}
            </div>
          </div>
          <div className='row m-t-20'>
            <div className='col-sm-12 text-center'>
              <Button
                text='픽 생성하기'
                loading={this.state.isLoading}
                onClick={this._handleOnClickGeneratePick}
              />
              <Button
                className='m-l-5'
                text='저장하기'
                loading={this.state.isLoading}
                onClick={this._handleOnClickSave}
              />
              {
                this.state.editMode === 'update' &&
                <Button
                  className='m-l-5'
                  text='삭제하기'
                  link
                  onClick={this._handleOnClickDelete}
                />
              }
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        {
          this.state.showStageForm &&
          <ContentContainer
            title='스테이지 등록'
            body={renderForm()}
          />
        }
        <ContentContainer
          body={renderList()}
          clearPadding
        />
      </div>
    )
  }
}

StageManagementView.contextTypes = {
  router: PropTypes.object.isRequired
}

StageManagementView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  stages: PropTypes.array,
  mons: PropTypes.array.isRequired
}

export default StageManagementView
