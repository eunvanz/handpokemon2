import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import _ from 'lodash'
import keygen from 'keygenerator'
import validator from 'validator'
import { toast } from 'react-toastify'

import Mon from 'models/mon'

import { attrs, generations } from 'constants/data'
import { MON_IMAGE_ROOT } from 'constants/urls'
import { getStandardCost } from 'constants/rules'

import { showAlert, convertEmptyStringToNullInObj } from 'utils/commonUtil'

import LabelInput from 'components/LabelInput'
import ContentContainer from 'components/ContentContainer'
import Selectbox from 'components/Selectbox'
import ImageInput from 'components/ImageInput'
import Button from 'components/Button'
import Img from 'components/Img'
import MonAttr from 'components/MonAttr'

import { postImage, deleteImage } from 'services/ImageService'
import { postMon, updateMon, deleteMon, getMonByNo } from 'services/MonService'
import { postTempMon, getTempMonByNo, deleteTempMon } from 'services/TempMonService'

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
      isTempMon: false,
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
    this._clearForm = this._clearForm.bind(this)
    this._handleOnClickApply = this._handleOnClickApply.bind(this)
    this._checkMonNo = this._checkMonNo.bind(this)
    this._isValidForm = this._isValidForm.bind(this)
    this._handleOnClickTempMon = this._handleOnClickTempMon.bind(this)
  }
  _handleOnClickWrite () {
    this.setState({ editMode: 'write', showForm: true })
    this._initFormData()
  }
  _handleOnClickMon (id) {
    const mon = this.props.mons.filter(mon => mon.id === id)[0]
    this.setState({
      showForm: true,
      editMode: 'update',
      isTempMon: false,
      formData: Object.assign({}, mon, { name: mon.name.ko, description: mon.description.ko, skill: mon.skill.ko })
    })
  }
  _handleOnClickTempMon (id) {
    const mon = this.props.tempMons.filter(mon => mon.id === id)[0]
    this.setState({
      showForm: true,
      editMode: 'update',
      isTempMon: true,
      formData: Object.assign({}, mon, { name: mon.name.ko, description: mon.description.ko, skill: mon.skill.ko })
    })
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    if (id === 'designer') {
      this.setState({ [id]: value })
    } else {
      let formData = fromJS(this.state.formData)
      if (id === 'grade') {
        if (value === 'b') formData = formData.set('point', 1)
        else if (value === 's') formData = formData.set('point', 0)
        else if (value === 'r') formData = formData.set('point', 3)
        else if (value === 'sr') formData = formData.set('point', 0)
        else if (value === 'e') formData = formData.set('point', 60)
        else if (value === 'l') formData = formData.set('point', 120)
      }
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
      if (formData.grade) {
        const cost = getStandardCost(formData.grade, total)
        newFormData = Object.assign({}, newFormData, { cost })
      }
      newFormData = Object.assign({}, newFormData, { total })
    }
    this.setState({ formData: newFormData })
  }
  _isValidForm () {
    const { formData } = this.state
    if (!validator.isInt(String(formData.no))) {
      window.swal({ text: '도감번호를 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (validator.isEmpty(formData.name)) {
      window.swal({ text: '이름을 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (validator.isEmpty(formData.mainAttr)) {
      window.swal({ text: '주속성을 선택해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.hp), { min: 1, max: 400 })) {
      window.swal({ text: '체력을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.power), { min: 1, max: 400 })) {
      window.swal({ text: '공격력을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.armor), { min: 1, max: 400 })) {
      window.swal({ text: '방어력을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.sPower), { min: 1, max: 400 })) {
      window.swal({ text: '특수공격력을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.sArmor), { min: 1, max: 400 })) {
      window.swal({ text: '특수방어력을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isInt(String(formData.dex), { min: 1, max: 400 })) {
      window.swal({ text: '민첩성을 1~400 사이의 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (validator.isEmpty(formData.skill)) {
      window.swal({ text: '기술명을 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isDecimal(String(formData.height))) {
      window.swal({ text: '키를 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (!validator.isDecimal(String(formData.weight))) {
      window.swal({ text: '몸무게를 숫자로 입력해주세요.' })
      this.setState({ isLoading: false })
      return false
    } else if (validator.isEmpty(formData.generation)) {
      window.swal({ text: '세대를 선택해주세요.' })
      this.setState({ isLoading: false })
      return false
    }
    return true
  }
  _clearForm () {
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
        point: 0,
        cost: 0,
        requiredLv: 0
      }
    })
  }
  _handleOnClickApply () {
    this.setState({ isLoading: true })
    const { firebase, user } = this.props
    const { formData } = this.state
    this._checkMonNo()
    .then(res => {
      if (!res) return
      if (this._isValidForm()) {
        const newFormData = convertEmptyStringToNullInObj(formData)
        const { name, description, skill, ...restFormData } = newFormData
        const mon = Object.assign({}, new Mon(), restFormData, { name: { ko: name }, description: { ko: description }, skill: { ko: skill }, isRegistered: false, applier: user })
        postTempMon(firebase, mon)
        .then(() => {
          toast('등록 신청되었습니다.')
          this.setState({ showForm: false })
          this._clearForm()
        })
      }
    })
  }
  _handleOnClickSave () {
    this.setState({ isLoading: true })
    const { firebase, mons } = this.props
    const { formData, editMode, designer, isTempMon } = this.state
    if (!this._isValidForm()) return
    if (formData.point === 0) return window.swal({ text: '콜렉션점수를 입력해주세요.' })
    if (formData.no === 0) return window.swal({ text: '도감번호를 입력해주세요.' })
    // ''은 null로 교체
    const newFormData = convertEmptyStringToNullInObj(formData)
    const { name, description, skill, ...restFormData } = newFormData
    const mon = Object.assign({}, new Mon(), restFormData, { name: { ko: name }, description: { ko: description }, skill: { ko: skill } })
    let tempMonId
    if (isTempMon) tempMonId = mon.id
    const monImageFile = document.getElementById('monImage').files[0]
    let postMonImageFile = () => Promise.resolve()
    if (monImageFile) monImageFile.filename = keygen._()
    if (monImageFile) postMonImageFile = () => postImage(firebase, MON_IMAGE_ROOT, [monImageFile], true)
    postMonImageFile()
    .then(res => {
      if (monImageFile) {
        const monImageURL = res[0].File.downloadURL
        const fullPath = res[0].File.fullPath
        const key = res[0].key
        const monImage = { fullPath, key, url: monImageURL, seq: formData.monImage && formData.monImage.length > 0 ? _.last(formData.monImage).seq + 1 : 0, designer }
        if (editMode === 'write' || !formData.monImage) {
          mon.monImage = []
        }
        mon.monImage.push(monImage)
      }
      if (isTempMon || editMode === 'write') return postMon(firebase, mon)
      return updateMon(firebase, mon)
    })
    .then(mon => { // 진화 전 포켓몬 선택했을경우 처리, postMon의 경우 post결과 mon을 파라미터로 가져옴
      if (formData.prev) {
        const monId = mon ? mon.id : formData.id
        let nextOfPrev = mons.filter(mon => mon.id === formData.prev)[0].next
        if (!nextOfPrev) nextOfPrev = []
        if (nextOfPrev.indexOf(monId) > -1) {
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
      if (isTempMon) deleteTempMon(firebase, tempMonId)
    })
    // .catch(() => {
    //   this.setState({ isLoading: false })
    //   showAlert({
    //     title: '저장실패..',
    //     text: '저장 중에 문제가 발생했습니다.',
    //     type: 'error'
    //   })
    // })
  }
  _handleOnClickDelMonImage (seq) {
    const { monImage } = this.state.formData
    const { formData } = this.state
    const { firebase } = this.props
    let newFormData = null
    // if (monImage.filter(item => item.seq === seq)[0].key) deleteImage(firebase, monImage.filter(item => item.seq === seq)[0].fullPath, `monImages/${monImage.filter(item => item.seq === seq)[0].item.key}`) // 현재 잘 안되고 있음 (Error: Firebase.child failed: First argument was an invalid path: "monImages/udumdesin.png". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]")
    Promise.resolve()
    .then(() => {
      const newMonImage = _.remove(monImage, image => {
        return image.seq !== seq
      })
      newFormData = Object.assign({}, formData, { monImage: newMonImage })
      return updateMon(firebase, newFormData)
      .then(() => {
        this.setState({ formData: newFormData })
      })
    })
    // .then(() => {
    //   this.setState({ formData: newFormData })
    // })
    .catch((err) => {
      showAlert({
        title: '삭제실패',
        text: '삭제 중 에러가 발생했습니다. - ' + err,
        type: 'error'
      })
    })
  }
  _handleOnClickDelete () {
    const { formData } = this.state
    const { firebase } = this.props
    deleteMon(firebase, formData)
    .then(() => {
      const promArr = formData.monImage.map(image => () => deleteImage(firebase, image.fullPath, image.key))
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
  _checkMonNo () {
    const { firebase } = this.props
    const { formData } = this.state
    const promArr = [getMonByNo(firebase, formData.no), getTempMonByNo(firebase, formData.no)]
    return Promise.all(promArr)
    .then(res => {
      if (res[0] || res[1]) {
        window.swal({ text: '이미 존재하는 포켓몬입니다.' })
        return Promise.resolve(false)
      } else {
        return Promise.resolve(true)
      }
    })
  }
  render () {
    const { auth, user } = this.props
    const renderElements = () => {
      if (this.props.mons) {
        return this.props.mons.map((mon, idx) => {
          return (
            <div className='list-group-item media' key={idx}>
              <div className='media-header pull-left'>
                <img src={mon.monImage[0].url} width='50' />
              </div>
              <div className='media-body'>
                <div className='lgi-heading' style={{ cursor: 'pointer' }}
                  onClick={() => this._handleOnClickMon(mon.id)}>{mon.no}. {mon.name.ko} : {mon.point} <MonAttr mainAttr={mon.mainAttr} subAttr={mon.subAttr} grade={mon.grade} />{mon.id}</div>
              </div>
            </div>
          )
        })
      } else {
        return <div className='text-center'>포켓몬이 없습니다.</div>
      }
    }
    const renderTempMons = () => {
      if (this.props.tempMons) {
        return this.props.tempMons.map((mon, idx) => {
          return (
            <div className='list-group-item media' key={idx}>
              <div className='media-body'>
                <div className='lgi-heading' style={{ cursor: 'pointer' }}
                  onClick={() => this._handleOnClickTempMon(mon.id)}>{mon.no}. {mon.name.ko} <MonAttr mainAttr={mon.mainAttr} subAttr={mon.subAttr} grade={mon.grade} /></div>
              </div>
            </div>
          )
        })
      } else {
        return <div className='text-center'>신청된 포켓몬이 없습니다.</div>
      }
    }
    const renderList = () => {
      return (
        <div className='list-group lg-odd-black'>
          <div className='action-header clearfix'>
            <div className='ah-label hidden-xs'>{user.authorization === 'admin' ? '포켓몬 리스트' : '포켓몬 등록신청 리스트'}</div>
            <ul className='actions'>
              <li>
                <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickWrite}>
                  <i className='fa fa-pencil' />
                </a>
              </li>
            </ul>
          </div>
          {user && user.authorization === 'admin' && renderElements()}
          {renderTempMons()}
        </div>
      )
    }
    const renderMonImageInfo = () => {
      const { monImage } = this.state.formData
      if (monImage) {
        return monImage.map((image, idx) => {
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
                onBlur={this._checkMonNo}
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
            {
              user && user.authorization === 'admin' &&
              <div>
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
            }
          </div>
          <div className='row'>
            {
              user && user.authorization === 'admin' &&
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
            }
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
            {
              user && user.authorization === 'admin' &&
              <div>
                <div className='col-sm-3'>
                  <Selectbox
                    id='prev'
                    defaultValue='진화 전 포켓몬'
                    options={this.props.mons.map(mon => {
                      return { name: mon.name.ko, value: mon.id }
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
          {
            user && user.authorization === 'admin' &&
            <div>
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
            </div>
          }
          <div className='row'>
            <div className='col-sm-12 text-center'>
              {
                this.state.editMode !== 'update' &&
                <Button
                  text='신청하기'
                  loading={this.state.isLoading}
                  onClick={this._handleOnClickApply}
                />
              }
              {
                user && user.authorization === 'admin' &&
                <Button
                  className='m-l-5'
                  text='저장하기'
                  loading={this.state.isLoading}
                  onClick={this._handleOnClickSave}
                />
              }
              {
                user && user.authorization === 'admin' && this.state.editMode === 'update' &&
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
            title={user.authorization === 'admin' ? '포켓몬 등록' : '포켓몬 등록신청'}
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
  mons: PropTypes.array,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tempMons: PropTypes.array
}

export default MonManagementView
