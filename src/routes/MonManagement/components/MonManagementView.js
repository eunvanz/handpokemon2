import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import _ from 'lodash'

import Mon from 'models/mon'

import { attrs, generations } from 'constants/data'
import { MON_IMAGE_ROOT } from 'constants/urls'

import { showAlert, convertEmptyStringToNullInObj } from 'utils/commonUtil'

import LabelInput from 'components/LabelInput'
import ContentContainer from 'components/ContentContainer'
import Selectbox from 'components/Selectbox'
import ImageInput from 'components/ImageInput'
import Button from 'components/Button'
import Img from 'components/Img'

import { postImage, deleteImage } from 'services/ImageService'
import { postMon, updateMon, deleteMon } from 'services/MonService'

class MonManagementView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        no: 0,
        name: '',
        description: '',
        mainAttr: '',
        subAttr: '',
        hp: 0,
        power: 0,
        armor: 0,
        sPower: 0,
        sArmor: 0,
        dex: 0,
        total: 0,
        grade: '',
        skill: '',
        generation: '',
        height: 0,
        weight: 0,
        prev: '',
        point: 0,
        cost: 0,
        requiredLv: 0
      },
      designer: '',
      showForm: false,
      editMode: 'write' // write, update
    }
    this._handleOnClickMon = this._handleOnClickMon.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnChangeNumberInput = this._handleOnChangeNumberInput.bind(this)
    this._getTotal = this._getTotal.bind(this)
    this._handleOnClickSave = this._handleOnClickSave.bind(this)
    this._initFormData = this._initFormData.bind(this)
    this._handleOnClickDelMonImage = this._handleOnClickDelMonImage.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._handleOnClickWrite = this._handleOnClickWrite.bind(this)
  }
  _handleOnClickWrite () {
    this.setState({ editMode: 'write', showForm: true })
    this._initFormData()
  }
  _handleOnClickMon (id) {
    this.setState({
      showForm: true,
      editMode: 'update',
      formData: this.props.mons.filter(mon => mon.id === id)[0]
    })
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    if (id === 'designer') {
      this.setState({ [id]: value })
    } else {
      const formData = fromJS(this.state.formData)
      this.setState({ formData: formData.set(id, value).toJS() })
    }
  }
  _getTotal () {
    const { hp, power, armor, sPower, sArmor, dex } = this.state.formData
    return hp + power + armor + sPower + sArmor + dex
  }
  _handleOnChangeNumberInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    const { formData } = this.state
    let newFormData
    if (['height', 'weight'].indexOf(id) > -1) newFormData = Object.assign({}, formData, { [id]: parseFloat(value) })
    else newFormData = Object.assign({}, formData, { [id]: parseInt(value) })
    // 능력치 데이터일 경우 total 계산
    if (['hp', 'power', 'armor', 'sPower', 'sArmor', 'dex'].indexOf(id) > -1) {
      const { hp, power, armor, sPower, sArmor, dex } = newFormData
      const total = hp + power + armor + sPower + sArmor + dex
      newFormData = Object.assign({}, newFormData, { total })
    }
    this.setState({ formData: newFormData })
  }
  _handleOnClickSave () {
    this.setState({ isLoading: true })
    const { firebase, mons } = this.props
    let { formData, editMode, designer } = this.state
    // ''은 null로 교체
    formData = convertEmptyStringToNullInObj(formData)
    const mon = Object.assign({}, new Mon(), formData)
    const monImageFile = document.getElementById('monImage').files[0]
    let postMonImageFile = () => Promise.resolve()
    if (monImageFile) postMonImageFile = () => postImage(firebase, MON_IMAGE_ROOT, [monImageFile])
    postMonImageFile()
    .then(res => {
      if (monImageFile) {
        const monImageURL = res[0].File.downloadURL
        const fullPath = res[0].File.fullPath
        const monImage = { fullPath, url: monImageURL, seq: formData.monImage && formData.monImage.length > 0 ? _.last(formData.monImage).seq + 1 : 0, designer }
        if (editMode === 'write' || !formData.monImage) {
          mon.monImage = []
        }
        mon.monImage.push(monImage)
      }
      if (editMode === 'write') return postMon(firebase, mon)
      return updateMon(firebase, mon)
    })
    .then(snapshot => { // 진화 전 포켓몬 선택했을경우 처리
      if (formData.prev) {
        const monId = snapshot ? snapshot.key : formData.id
        let nextOfPrev = mons.filter(mon => mon.id === formData.prev)[0].next
        if (!nextOfPrev) nextOfPrev = []
        else if (nextOfPrev.indexOf(monId) > -1) {
          // 이미 진화 전 포켓몬의 next포켓몬으로 등록되어있는 경우 아무것도 안함
        } else nextOfPrev.push(monId)
        return updateMon(firebase, { id: formData.prev, next: nextOfPrev, evoLv: parseInt(formData.requiredLv) })
      }
      return Promise.resolve()
    })
    .then(() => {
      this.setState({ isLoading: false, formData: mon })
      showAlert({
        title: '저장완료!',
        text: '성공적으로 저장 되었습니다',
        type: 'success'
      })
    })
    .catch(() => {
      this.setState({ isLoading: false })
      showAlert({
        title: '저장실패..',
        text: '저장 중에 문제가 발생했습니다.',
        type: 'error'
      })
    })
  }
  _handleOnClickDelMonImage (seq) {
    const { monImage } = this.state.formData
    const { formData } = this.state
    const { firebase } = this.props
    let newFormData = null
    deleteImage(firebase, monImage.filter(item => item.seq === seq)[0].fullPath)
    .then(() => {
      const newMonImage = _.remove(monImage, image => {
        return image.seq !== seq
      })
      newFormData = Object.assign({}, formData, { monImage: newMonImage })
      updateMon(firebase, newFormData)
      .then(() => {
        this.setState({ formData: newFormData })
      })
    })
    // .then(() => {
    //   this.setState({ formData: newFormData })
    // })
    .catch(() => {
      showAlert({
        title: '삭제실패',
        text: '삭제 중 에러가 발생했습니다.',
        type: 'error'
      })
    })
  }
  _handleOnClickDelete () {
    const { formData } = this.state
    const { firebase } = this.props
    deleteMon(firebase, formData)
    .then(() => {
      const promArr = formData.monImage.map(image => () => deleteImage(firebase, image.fullPath))
      return Promise.all(promArr)
    })
    .then(() => {
      this._initFormData()
    })
  }
  _initFormData () {
    this.setState({
      formData: {
        no: 0,
        name: '',
        description: '',
        mainAttr: '',
        subAttr: '',
        hp: 0,
        power: 0,
        armor: 0,
        sPower: 0,
        sArmor: 0,
        dex: 0,
        total: 0,
        grade: '',
        skill: '',
        generation: '',
        height: 0,
        weight: 0,
        prev: '',
        evoLv: 0,
        point: 0,
        cost: 0
      },
      editMode: 'write',
      designer: ''
    })
  }
  render () {
    const renderElements = () => {
      if (this.props.mons) {
        return this.props.mons.map((mon, idx) => {
          return (
            <div className='list-group-item media' key={idx}>
              <div className='media-body'>
                <div className='lgi-heading' style={{ cursor: 'pointer' }}
                  onClick={() => this._handleOnClickMon(mon.id)}>{mon.name}</div>
              </div>
            </div>
          )
        })
      } else {
        return <div className='text-center'>포켓몬이 없습니다.</div>
      }
    }
    const renderList = () => {
      return (
        <div className='list-group lg-odd-black'>
          <div className='action-header clearfix'>
            <div className='ah-label hidden-xs'>포켓몬 리스트</div>
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
    const renderMonImageInfo = () => {
      const { monImage } = this.state.formData
      if (monImage) {
        return monImage.map((image, idx) => {
          console.log('renderMonImage', monImage)
          return (
            <div className='col-sm-2 text-center' key={idx}>
              <Img src={image.url} width='100%' />
              <p className='text-center'>디자이너: {image.designer}</p>
              <Button
                text='삭제'
                color='red'
                onClick={() => this._handleOnClickDelMonImage(image.seq)}
              />
            </div>
          )
        })
      }
    }
    const renderForm = () => {
      return (
        <div className='container'>
          <div className='row'>
            <div className='col-sm-3'>
              <LabelInput
                label='도감번호'
                id='no'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='no'
                value={this.state.formData.no}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-3'>
              <LabelInput
                label='이름'
                id='name'
                type='text'
                onChange={this._handleOnChangeInput}
                name='name'
                value={this.state.formData.name}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-3'>
              <Selectbox
                id='mainAttr'
                defaultValue='주속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={this.state.formData.mainAttr}
              />
            </div>
            <div className='col-sm-3'>
              <Selectbox
                id='subAttr'
                defaultValue='보조속성 선택'
                options={attrs.map(attr => {
                  return { name: attr, value: attr }
                })}
                onChange={this._handleOnChangeInput}
                value={this.state.formData.subAttr}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-2'>
              <LabelInput
                label='체력'
                id='hp'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='hp'
                value={this.state.formData.hp}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='공격력'
                id='power'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='power'
                value={this.state.formData.power}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='방어력'
                id='armor'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='armor'
                value={this.state.formData.armor}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='특수공격력'
                id='sPower'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='sPower'
                value={this.state.formData.sPower}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='특수방어력'
                id='sArmor'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='sArmor'
                value={this.state.formData.sArmor}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='민첩성'
                id='dex'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='dex'
                value={this.state.formData.dex}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='종합'
                disabled
                id='total'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='total'
                value={this.state.formData.total}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='기술명'
                id='skill'
                type='text'
                onChange={this._handleOnChangeInput}
                name='skill'
                value={this.state.formData.skill}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='평균키'
                id='height'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='height'
                value={this.state.formData.height}
                floating
                length={12}
                step={0.1}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='평균몸무게'
                id='weight'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='weight'
                value={this.state.formData.weight}
                floating
                length={12}
                step={0.1}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='포인트'
                id='point'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='point'
                value={this.state.formData.point}
                floating
                length={12}
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='코스트'
                id='cost'
                type='number'
                onChange={this._handleOnChangeNumberInput}
                name='cost'
                value={this.state.formData.cost}
                floating
                length={12}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-3'>
              <Selectbox
                id='grade'
                defaultValue='등급선택'
                options={[
                  { name: 'BASIC', value: 'b' },
                  { name: 'RARE', value: 'r' },
                  { name: 'SPECIAL', value: 's' },
                  { name: 'S.RARE', value: 'sr' },
                  { name: 'ELITE', value: 'e' },
                  { name: 'LEGEND', value: 'l' }
                ]}
                onChange={this._handleOnChangeInput}
                value={this.state.formData.grade}
              />
            </div>
            <div className='col-sm-3'>
              <Selectbox
                id='generation'
                defaultValue='세대선택'
                options={generations.map(generation => {
                  return { name: `${generation}세대`, value: generation }
                })}
                onChange={this._handleOnChangeInput}
                value={this.state.formData.generation}
              />
            </div>
            <div className='col-sm-3'>
              <Selectbox
                id='prev'
                defaultValue='진화 전 포켓몬'
                options={this.props.mons.map(mon => {
                  return { name: mon.name, value: mon.id }
                })}
                onChange={this._handleOnChangeInput}
                value={this.state.formData.prev}
              />
            </div>
            {
              this.state.formData.prev &&
              <div className='col-sm-2'>
                <LabelInput
                  label='진화필요레벨'
                  id='requiredLv'
                  type='number'
                  onChange={this._handleOnChangeNumberInput}
                  name='requiredLv'
                  value={this.state.formData.requiredLv}
                  floating
                  length={12}
                />
              </div>
            }
          </div>
          <div className='row'>
            <div className='col-sm-12'>
              <LabelInput
                label='소개'
                id='description'
                type='text'
                onChange={this._handleOnChangeInput}
                name='description'
                value={this.state.formData.description}
                floating
                length={12}
              />
            </div>
          </div>
          <div className='row m-b-30'>
            {renderMonImageInfo()}
          </div>
          <div className='row'>
            <div className='col-sm-3'>
              <ImageInput
                id='monImage'
              />
            </div>
            <div className='col-sm-2'>
              <LabelInput
                label='디자이너'
                id='designer'
                type='text'
                onChange={this._handleOnChangeInput}
                name='designer'
                value={this.state.designer}
                floating
                length={12}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 text-center'>
              <Button
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
          this.state.showForm &&
          <ContentContainer
            title='포켓몬 등록'
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

MonManagementView.contextTypes = {
  router: PropTypes.object.isRequired
}

MonManagementView.propTypes = {
  firebase: PropTypes.object.isRequired,
  mons: PropTypes.array
}

export default MonManagementView