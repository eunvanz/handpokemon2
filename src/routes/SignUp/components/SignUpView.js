import React from 'react'
import PropTypes from 'prop-types'
import validator from 'validator'
import { fromJS } from 'immutable'
import keygen from 'keygenerator'

import ContentContainer from 'components/ContentContainer'
import LabelInput from 'components/LabelInput'
import Button from 'components/Button'
import TextArea from 'components/TextArea'
import MonCard from 'components/MonCard'
import Loading from 'components/Loading'
import AvatarImgInput from 'components/AvatarImgInput'
import WarningText from 'components/WarningText'

import { isDupEmail, isDupNickname, signUp, getUserIdByRecommenderCode, signUpWithSocialAccount,
  isValidRecommenderCode, setUserPath } from 'services/UserService'
import { getStartPick } from 'services/MonService'
import { postImage } from 'services/ImageService'
import { postCollection } from 'services/CollectionService'

import { DEFAULT_PROFILE_IMAGE_URL, PROFILE_IMAGE_ROOT } from 'constants/urls'

import { showAlert, dataURItoBlob, isIE, getSeqPromise, isStringLength, getMsg, isScreenSize,
  flattenFirebaseObject } from 'utils/commonUtil'

import User from 'models/user'

class SignUpView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSocialAccount: props.user !== null,
      step: 1,
      formData: {
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        introduce: '',
        recommenderCode: ''
      },
      isValid: { // 0: 입력 전, 1: 유효, -1: 유효하지 않음
        email: props.user && props.user.email ? 1 : 0,
        password: props.user && props.user.email ? 1 : 0,
        passwordConfirm: props.user && props.user.email ? 1 : 0,
        nickname: 0,
        recommenderCode: 0
      },
      helper: {
        email: null,
        password: null,
        passwordConfirm: null,
        nickname: null,
        recommenderCode: null
      },
      startPick: null,
      loading: false,
      profileImageFile: null,
      isApplicable: false,
      signUpProcess: false,
      recommender: null,
      isGoogleLoading: false,
      isFacebookLoading: false
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
    this._handleOnClickSignInWith = this._handleOnClickSignInWith.bind(this)
    this._checkRecommenderCode = this._checkRecommenderCode.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.user && this.props.user.nickname) this.context.router.push('/')
  }
  componentWillUnmount () {
    const { firebase, auth, user } = this.props
    const { signUpProcess } = this.state
    if (!signUpProcess && auth && !user) {
      firebase.remove(`users/${auth.uid}`)
      .then(() => {
        firebase.auth().currentUser.delete()
      })
      .then(() => location.reload())
    }
  }
  _handleOnChangeInput (e) {
    let { name, value } = e.target
    if (name !== 'introduce') value = validator.blacklist(value, ' ')
    const formData = fromJS(this.state.formData)
    this.setState({ formData: formData.set(name, value).toJS() })
  }
  _checkEmailField () {
    if (this.state.isSocialAccount) return true
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
    else if (isStringLength(nickname) > 16) message = '한글 8자, 영문 16자 이하의 닉네임을 사용해주세요.'
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
    if (this.state.isSocialAccount) return true
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
    if (this.state.isSocialAccount) return true
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
  _checkRecommenderCode () {
    const { firebase } = this.props
    const code = this.state.formData.recommenderCode
    if (code.length === 0) return
    isValidRecommenderCode(firebase, code)
    .then(user => {
      if (user) {
        const recommender = flattenFirebaseObject(user)
        this.setState({ recommender: recommender })
        this._setValidAndHelper('recommenderCode', null, 'success')
        return true
      } else {
        this._setValidAndHelper('recommenderCode', '존재하지 않는 코드입니다.', 'error')
        return false
      }
    })
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
    const { firebase, auth } = this.props
    const { formData, profileImageFile, isSocialAccount, recommender } = this.state
    let postProfileImage = () => Promise.resolve()
    if (profileImageFile) {
      postProfileImage = () => postImage(firebase, PROFILE_IMAGE_ROOT, [profileImageFile])
    }
    let profileImageUrl = DEFAULT_PROFILE_IMAGE_URL
    let profileImageKey = null
    postProfileImage()
    .then(res => {
      if (profileImageFile) {
        profileImageUrl = res[0].File.downloadURL
        profileImageKey = res[0].key
      }
      let user = {
        email: isSocialAccount ? this.props.auth.providerData[0].email : formData.email,
        password: formData.password,
        nickname: formData.nickname,
        profileImage: profileImageUrl,
        profileImageKey: profileImageKey,
        introduce: formData.introduce,
        isSocialAccount,
        recommender
      }
      user = Object.assign({}, new User(), user)
      if (isSocialAccount) return signUpWithSocialAccount(firebase, auth.uid, user)
      return signUp(firebase, user)
    })
    .then(user => {
      return getUserIdByRecommenderCode(firebase, user.recommenderCode)
    })
    .then(userId => {
      const { startPick } = this.state
      const promArr = startPick.map(col => () => postCollection(firebase, userId, col, 'signUp'))
      return getSeqPromise(promArr)
    })
    .then(() => {
      const { setTutorialModal } = this.props
      setTutorialModal({
        show: true,
        content: <div>정식 트레이너가 된 것을 축하해! 나는 <span className='c-lightblue'>운영자웅이</span>라고 해. 너의 모험을 도와줄 사람이지.</div>,
        onClickContinue: () => {
          return setTutorialModal({
            show: true,
            content: <div>우선 가장 기본이 되는 포켓몬 채집부터 해볼까? 사이드 메뉴에서 <span className='c-lightblue'>포켓몬 채집</span>메뉴를 선택해 봐.</div>,
            onClickContinue: () => {
              setTutorialModal({
                show: false
              })
            }
          })
        }
      })
      // showAlert({
      //   title: '정식 포켓몬 트레이너가 된 것을 축하드립니다!',
      //   text: '지금 바로 포켓몬을 채집하러 떠나보세요.',
      //   type: 'success',
      //   confirmButtonText: '포켓몬 채집하기'
      // })
      // .then(() => {
      //   document.getElementById('sidebarProfileImage').src = profileImageUrl
      //   this.context.router.push('/pick-district')
      // })
    })
    .catch((msg) => {
      showAlert({
        title: 'OOPS!',
        text: '회원가입 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요 - ' + msg,
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
      if (window.editor) {
        const dataURI = window.editor.getImageScaledToCanvas().toDataURL()
        if (dataURI) {
          const blob = dataURItoBlob(dataURI)
          this.setState({ profileImageFile: new File([blob], keygen._(), { type: blob.type }) })
        }
      }
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
      if (!this.state.isApplicable) this.setState({ isApplicable: true })
    })
  }
  _handleOnClickSignInWith (provider) {
    let loadingName
    if (provider === 'google') loadingName = 'isGoogleLoading'
    else if (provider === 'facebook') loadingName = 'isFacebookLoading'
    this.setState({ [loadingName]: true })
    const { firebase } = this.props
    firebase.login({ provider })
  }
  render () {
    const { messages, locale } = this.props
    const { isGoogleLoading, isFacebookLoading } = this.state
    const renderPickedMon = () => {
      const { startPick, loading } = this.state
      if (loading) return <Loading height={242} />
      else if (!startPick) return null
      let seq = 0
      return startPick.map(mon => {
        seq++
        return (
          <MonCard mon={{ tobe: mon }} key={seq} type='collection'
            className={`${seq === 1 ? 'col-md-offset-3 col-sm-offset-1 col-xs-offset-0' : ''}`} />
        )
      })
    }
    const renderTab = () => {
      const { step, isSocialAccount } = this.state
      let resultComponent = null
      if (step === 1) {
        resultComponent = (
          <div className='form-horizontal'>
            {
              !isSocialAccount &&
              <div>
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
                />
                <div className='col-sm-offset-4 p-l-10 c-lightblue' style={{ fontSize: '12px', marginTop: '-20px', marginBottom: '20px' }}>비밀번호 변경 및 찾기를 위해 실제 사용 메일을 입력해주세요.</div>
                {
                  this.state.formData.email.length === 0 &&
                  <div className='form-group'>
                    <div className='col-sm-offset-4 col-sm-8 m-b-25'>
                      <p className='m-b-10'>{getMsg(messages.signUpView.signUpWith, locale)}</p>
                      <Button icon='zmdi zmdi-google' text='google' color='red' style={{ width: '120px' }}
                        onClick={() => this._handleOnClickSignInWith('google')} loading={isGoogleLoading} disabled={isFacebookLoading}
                      />
                      {/*<Button className='m-l-5' icon='zmdi zmdi-facebook' text='facebook' color='blue' style={{ width: '120px' }}
                        onClick={() => this._handleOnClickSignInWith('facebook')} loading={isFacebookLoading} disabled={isGoogleLoading}
                      />*/}
                    </div>
                  </div>
                }
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
                />
              </div>
            }
            <LabelInput
              label='닉네임'
              id='nickname'
              name='nickname'
              type='text'
              placeholder='8자 이하의 한글, 16자 이하의 영문 및 숫자'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.nickname}
              has={this._getHas('nickname')}
              feedback
              helper={this.state.helper.nickname}
              onBlur={this._checkNicknameField}
              length={4}
            />
          </div>
        )
      } else if (step === 2) {
        resultComponent = (
          <div>
            <LabelInput
              label='추천인 코드'
              id='recommenderCode'
              name='recommenderCode'
              type='text'
              onChange={this._handleOnChangeInput}
              value={this.state.formData.recommenderCode}
              has={this._getHas('recommenderCode')}
              feedback
              helper={this.state.helper.recommenderCode}
              onBlur={this._checkRecommenderCode}
              length={6}
              floating
            />
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
              {/*<ImageInput id='profileImage' />*/}
              {!isIE() && <AvatarImgInput />}
              {isIE() && <WarningText text='익스플로러에서는 지원하지 않습니다.' />}
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
                    icon={this.state.startPick ? 'fa fa-sync' : 'fa fa-paw'} color='orange'
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
              disabled={this.state.loading || (this.state.step === 3 && !this.state.isApplicable)}
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
  receiveUser: PropTypes.func.isRequired,
  user: PropTypes.object,
  auth: PropTypes.object,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default SignUpView
