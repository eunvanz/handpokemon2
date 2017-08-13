import React from 'react'
import PropTypes from 'prop-types'

import validator from 'validator'
import { fromJS } from 'immutable'
import keygen from 'keygenerator'

import ContentContainer from 'components/ContentContainer'
import LabelInput from 'components/LabelInput'
import Button from 'components/Button'
import TextArea from 'components/TextArea'
import ImageInput from 'components/ImageInput'
import MonCard from 'components/MonCard'
import Loading from 'components/Loading'

import { isDupEmail, isDupNickname, signUp, getUserIdByEmail } from 'services/UserService'
import { getStartPick } from 'services/MonService'
import { postImage } from 'services/ImageService'
import { postCollection } from 'services/CollectionService'

import { DEFAULT_PROFILE_IMAGE_URL, PROFILE_IMAGE_ROOT } from 'constants/urls'

import { showAlert } from 'utils/commonUtil'

import User from 'models/user'

class SignUpView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      formData: {
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        introduce: ''
      },
      isValid: { // 0: 입력 전, 1: 유효, -1: 유효하지 않음
        email: 0,
        password: 0,
        passwordConfirm: 0,
        nickname: 0
      },
      helper: {
        email: null,
        password: null,
        passwordConfirm: null,
        nickname: null
      },
      startPick: null,
      loading: false,
      profileImageFile: null,
      applicable: false,
      signUpProcess: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._checkEmailField = this._checkEmailField.bind(this)
    this._getHas = this._getHas.bind(this)
    this._setValidAndHelper = this._setValidAndHelper.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._checkPasswordConfirmField = this._checkPasswordConfirmField.bind(this)
    this._handleOnClickNext = this._handleOnClickNext.bind(this)
    this._handleOnClickPrev = this._handleOnClickPrev.bind(this)
    this._checkNicknameField = this._checkNicknameField.bind(this)
    this._handleOnClickPick = this._handleOnClickPick.bind(this)
  }
  _handleOnChangeInput (e) {
    let { name, value } = e.target
    if (name !== 'introduce') value = validator.blacklist(value, ' ')
    const formData = fromJS(this.state.formData)
    this.setState({ formData: formData.set(name, value).toJS() })
  }
  _checkEmailField () {
    const { firebase } = this.props
    let email = this.state.formData.email
    let message = ''
    if (validator.isEmpty(email)) message = '이메일주소를 입력해주세요.'
    else if (!validator.isEmail(email)) message = '이메일주소 형식이 아닙니다.'
    else if (!validator.isLength(email, { min: 5, max: 50 })) message = '5~50자의 이메일주소를 사용해주세요.'
    if (message !== '') {
      this._setValidAndHelper('email', message, 'error')
      return false
    }
    email = validator.normalizeEmail(email)
    return isDupEmail(firebase, email)
    .then(isDup => {
      if (isDup) {
        this._setValidAndHelper('email', '이미 사용중인 이메일주소입니다.', 'error')
        return false
      } else {
        this._setValidAndHelper('email', null, 'success')
        return true
      }
    })
    .catch(() => {
      window.swal({
        confirmButtonText: '확인',
        title: '이메일 중복체크 오류',
        text: '이메일 중복체크 도중 오류가 발생했습니다. 다시 한 번 시도해주세요.',
        type: 'error'
      })
      this._setValidAndHelper('email', '다시 한 번 시도해주세요.', 'error')
      return false
    })
  }
  _checkNicknameField () {
    const { firebase } = this.props
    let nickname = this.state.formData.nickname
    let message = ''
    if (validator.isEmpty(nickname)) message = '닉네임을 입력해주세요.'
    else if (!validator.isLength(nickname, { min: 1, max: 8 })) message = '8자 이하의 닉네임을 사용해주세요.'
    if (message !== '') {
      this._setValidAndHelper('nickname', message, 'error')
      return false
    }
    nickname = validator.escape(nickname) // HTML용으로 변경, replace <, >, &, ', " and / with HTML entities.
    return isDupNickname(firebase, nickname)
    .then(isDup => {
      if (isDup) {
        this._setValidAndHelper('nickname', '이미 사용중인 닉네임입니다.', 'error')
        return false
      } else {
        this._setValidAndHelper('nickname', null, 'success')
        return true
      }
    })
    .catch(() => {
      window.swal(
        '닉네임 중복체크 오류',
        '닉네임 중복체크 도중 오류가 발생했습니다. 다시 한 번 시도해주세요.',
        'error'
      )
      this._setValidAndHelper('nickname', '다시 한 번 시도해주세요.', 'error')
      return false
    })
  }
  _checkPasswordField () {
    const password = this.state.formData.password
    let message = ''
    if (validator.isEmpty(password)) message = '비밀번호를 입력해주세요.'
    else if (!validator.isLength(password, { min: 6, max: 20 })) message = '6~20자의 비밀번호를 입력해주세요.'
    else if (validator.contains(password, ' ')) message = '공백이 없는 비밀번호를 입력해주세요.'
    if (message !== '') {
      this._setValidAndHelper('password', message, 'error')
      return false
    } else {
      this._setValidAndHelper('password', null, 'success')
      return true
    }
  }
  _checkPasswordConfirmField () {
    const password = this.state.formData.passwordConfirm
    let message = ''
    if (validator.isEmpty(password)) message = '비밀번호를 입력해주세요.'
    else if (!validator.isLength(password, { min: 6, max: 20 })) message = '6~20자의 비밀번호를 입력해주세요.'
    else if (validator.contains(password, ' ')) message = '공백이 없는 비밀번호를 입력해주세요.'
    else if (this.state.formData.password !== password) message = '비밀번호가 틀립니다.'
    if (message !== '') {
      this._setValidAndHelper('passwordConfirm', message, 'error')
      return false
    } else {
      this._setValidAndHelper('passwordConfirm', null, 'success')
      return true
    }
  }
  _setValidAndHelper (field, message, has) {
    const isValid = fromJS(this.state.isValid)
    const helper = fromJS(this.state.helper)
    this.setState({
      isValid: isValid.set(field, has === 'success' ? 1 : -1).toJS(),
      helper: helper.set(field, message).toJS()
    })
  }
  _getHas (field) {
    const condition = this.state.isValid[field]
    if (condition === 0) {
      return null
    } else if (condition === 1) {
      return 'success'
    } else if (condition === -1) {
      return 'error'
    }
  }
  _processSignUp () {
    this.setState({ signUpProcess: true })
    const { firebase } = this.props
    const { formData, profileImageFile } = this.state
    let postProfileImage = () => Promise.resolve()
    if (profileImageFile) {
      postProfileImage = () => postImage(firebase, PROFILE_IMAGE_ROOT, [profileImageFile])
    }
    let profileImageUrl = DEFAULT_PROFILE_IMAGE_URL
    postProfileImage()
    .then(res => {
      if (profileImageFile) profileImageUrl = res[0].File.downloadURL
      let user = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        profileImage: profileImageUrl,
        introduce: formData.introduce
      }
      user = Object.assign({}, new User(), user)
      return signUp(firebase, user)
    })
    .then(user => {
      return getUserIdByEmail(firebase, user.email)
    })
    .then(userId => {
      const { startPick } = this.state
      const promArr = startPick.map(col => postCollection(firebase, userId, col))
      return Promise.all(promArr)
    })
    .then(() => {
      showAlert({
        title: '정식 포켓몬 트레이너가 된 것을 축하드립니다!',
        text: '지금 바로 포켓몬을 채집하러 떠나보세요.',
        type: 'success',
        confirmButtonText: '포켓몬 채집하기'
      })
      .then(() => {
        this.context.router.push('/pick-district')
      })
    })
    .catch(() => {
      showAlert({
        title: 'OOPS!',
        text: '회원가입 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        type: 'error'
      })
    })
  }
  _handleOnClickNext () {
    const { step } = this.state
    if (step === 1) {
      if (this._checkEmailField() && this._checkPasswordField() && this._checkPasswordConfirmField()) {
        this.setState({ step: this.state.step + 1 })
      }
    } else if (step === 3) {
      this._processSignUp()
    } else if (step === 2) {
      this.setState({ profileImageFile: document.getElementById('profileImage').files[0] })
      this.setState({ step: this.state.step + 1 })
    }
  }
  _handleOnClickPrev () {
    this.setState({ step: this.state.step - 1 })
  }
  _handleOnClickPick () {
    const { firebase } = this.props
    this.setState({ loading: true })
    getStartPick(firebase)
    .then(startPick => {
      this.setState({ startPick })
      this.setState({ loading: false })
      if (!this.state.applicable) this.setState({ applicable: true })
    })
  }
  render () {
    const renderPickedMon = () => {
      const { startPick, loading } = this.state
      if (loading) return <Loading height={249} />
      else if (!startPick) return null
      let seq = 0
      return startPick.map(mon => {
        seq++
        return (
          <MonCard mon={mon} key={keygen._()} type='collection'
            className={`${seq === 1 ? 'col-md-offset-3 col-sm-offset-1 col-xs-offset-0' : ''}`} />
        )
      })
    }
    const renderTab = () => {
      const { step } = this.state
      let resultComponent = null
      if (step === 1) {
        resultComponent = (
          <div className='form-horizontal'>
            <LabelInput
              label='이메일주소'
              id='email'
              name='email'
              type='email'
              placeholder='example@handpokemon.com'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.email}
              has={this._getHas('email')}
              feedback
              helper={this.state.helper.email}
              onBlur={this._checkEmailField}
              length={4}
              fontSize='md'
            />
            <LabelInput
              label='비밀번호'
              id='password'
              name='password'
              type='password'
              placeholder='6~20자의 영문, 숫자 및 특수문자'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.password}
              has={this._getHas('password')}
              feedback
              helper={this.state.helper.password}
              onBlur={this._checkPasswordField}
              length={4}
              fontSize='md'
            />
            <LabelInput
              label='비밀번호 확인'
              id='passwordConfirm'
              name='passwordConfirm'
              type='password'
              placeholder='6~20자의 영문, 숫자 및 특수문자'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.passwordConfirm}
              has={this._getHas('passwordConfirm')}
              feedback
              helper={this.state.helper.passwordConfirm}
              onBlur={this._checkPasswordConfirmField}
              length={4}
              fontSize='md'
            />
            <LabelInput
              label='닉네임'
              id='nickname'
              name='nickname'
              type='text'
              placeholder='8자 이하의 한글, 영문 혹은 숫자 및 특수문자'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.nickname}
              has={this._getHas('nickname')}
              feedback
              helper={this.state.helper.nickname}
              onBlur={this._checkNicknameField}
              length={4}
              fontSize='md'
            />
          </div>
        )
      } else if (step === 2) {
        resultComponent = (
          <div>
            <p className='col-sm-offset-3 col-sm-6 f-700'>자기소개</p>
            <div className='col-sm-offset-3 col-sm-6'>
              <TextArea
                id='introduce'
                name='introduce'
                placeholder='80자 이하로 본인을 소개해주세요.'
                onChange={this._handleOnChangeInput}
                value={this.state.formData.introduce}
                maxLength={80}
                autoSize
                disableEnter
              />
            </div>
            <p className='col-sm-offset-3 col-sm-6 f-700'>프로필사진</p>
            <div className='col-sm-offset-3 col-sm-6'>
              <ImageInput id='profileImage' />
            </div>
          </div>
        )
      } else {
        resultComponent = (
          <div style={{ marginTop: '45px' }}>
            {renderPickedMon()}
            <div className='row'>
              <div className='col-xs-12'>
                <h4 className='text-center'
                  style={{ marginBottom: '15px' }}>
                  {this.state.startPick ? '마음에 드는 친구가 없으면 다시 채집해보세요.' : '함께 여행을 시작할 포켓몬을 채집해보세요.'}
                </h4>
                <p className='text-center'>
                  <Button text={this.state.startPick ? '다시채집' : '채집하기'}
                    icon={this.state.startPick ? 'fa fa-refresh' : 'fa fa-paw'} color='orange'
                    onClick={this._handleOnClickPick}
                    loading={this.state.loading}
                    disabled={this.state.signUpProcess}
                  />
                </p>
              </div>
            </div>
          </div>
        )
      }
      return resultComponent
    }
    const renderBody = () => {
      return (
        <div className='form-wizard-basic fw-container'>
          <ul className='tab-nav text-center fw-nav f-14' data-tab-color='amber'>
            <li className={this.state.step === 1 ? 'active' : null}>
              <a>필수정보 입력</a>
            </li>
            <li className={this.state.step === 2 ? 'active' : null}>
              <a>선택정보 입력</a>
            </li>
            <li className={this.state.step === 3 ? 'active' : null}>
              <a>스타트픽 선택</a>
            </li>
          </ul>
          <div className='tab-content'>
            {renderTab()}
          </div>
          <div className='fw-footer pagination wizard'>
            {
              this.state.step !== 1 &&
              <Button text='이전단계' icon='zmdi zmdi-arrow-back' link className='m-r-5'
                disabled={this.state.loading || this.state.signUpProcess}
                onClick={this._handleOnClickPrev} />
            }
            <Button text={this.state.step === 3 ? '가입신청' : '다음단계'}
              icon={this.state.step === 3 ? 'zmdi zmdi-check' : 'zmdi zmdi-arrow-forward'}
              iconRight color={this.state.step === 3 ? 'green' : 'blue'} onClick={this._handleOnClickNext}
              disabled={this.state.loading || (this.state.step === 3 && !this.state.applicable)}
              loading={this.state.signUpProcess}
            />
          </div>
        </div>
      )
    }
    return (
      <ContentContainer
        title='포켓몬 트레이너 라이센스 등록'
        body={renderBody()}
      />
    )
  }
}

SignUpView.contextTypes = {
  router: PropTypes.object.isRequired
}

SignUpView.propTypes = {
  firebase: PropTypes.object.isRequired,
  receiveUser: PropTypes.func.isRequired
}

export default SignUpView
