import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import keygen from 'keygenerator'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import Roulette from 'components/Roulette'
import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import Button from 'components/Button'
import HonorModal from 'components/HonorModal'

import { getPickMons, getNextMons } from 'services/MonService'
import { postCollection } from 'services/CollectionService'
import { decreaseCredit, refreshUserCredits, setUserPath, updateUserPokemoney } from 'services/UserService'

import { PICK_MON_ROULETTE_DELAY, getMixGrades } from 'constants/rules'
import { attrs as allAttrs } from 'constants/data'

import { mergePickResults } from 'utils/monUtil'
import { showAlert, countAttrsInCollections, convertMapToArr, getMsg } from 'utils/commonUtil'

class PickMonView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pickedIdx: -1,
      picks: null,
      mode: null,
      multiPicks: null,
      stop: false,
      result: null
    }
    this._initPick = this._initPick.bind(this)
    this._handleOnClickContinue = this._handleOnClickContinue.bind(this)
    this._checkHonorGot = this._checkHonorGot.bind(this)
  }
  componentDidMount () {
    const { pickMonInfo, auth } = this.props
    if (!auth) return this.context.router.replace('sign-in')
    if (!pickMonInfo) return this.context.router.replace('pick-district')
    this._initPick()
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  // componentWillUpdate (nextProps, nextState) {
  //   if (nextProps.location.query.f !== this.props.location.query.f) {
  //     this.setState({
  //       pickedIdx: -1,
  //       picks: null,
  //       mode: null,
  //       multiPicks: null,
  //       stop: false,
  //       result: null
  //     })
  //     this._initPick()
  //   }
  // }
  componentDidUpdate (prevProps, prevState) {
    if (!this.props.auth) return this.context.router.replace('sign-in')
    if (prevProps.location.query.f !== this.props.location.query.f) {
      this.setState({
        pickedIdx: -1,
        picks: null,
        mode: null,
        multiPicks: null,
        stop: false,
        result: null
      })
      this._initPick()
    }
    if (!prevState.multiPicks && this.state.multiPicks) {
      const { setTutorialModal, user, firebase, auth } = this.props
      if (user.isTutorialOn && (user.tutorialStep === 3 || user.tutorialStep === 4) && user.pickCredit > 0) {
        setTutorialModal({
          show: true,
          content: <div>포켓몬들을 발견했어! 어디 얼마나 귀여운 녀석들이 발견됐는지 확인해볼까? 확인 후에는 남은 크레딧으로 한번 더 채집해보자.</div>,
          onClickContinue: () => {
            setUserPath(firebase, auth.uid, 'tutorialStep', 4)
            .then(() => {
              setTutorialModal({ show: false })
            })
          }
        })
      } else if (user.isTutorialOn && (user.tutorialStep === 4 || user.tutorialStep === 3) && user.pickCredit === 0) {
        setTutorialModal({
          show: true,
          content: <div>채집 크레딧을 모두 소모했어. 채집 크레딧은 <span className='c-lightblue'>20분</span>마다 한번씩 충전 된단다. <span className='c-lightblue'>최대 12개</span>까지 모아둘 수 있으니, 4시간에 한번씩 채집을하면 최대 효율로 채집할 수 있겠지?</div>,
          onClickContinue: () => {
            setTutorialModal({
              show: true,
              content: <div>새로운 포켓몬을 발견하면 콜렉션 점수가 상승하고, 이미 가지고 있는 포켓몬을 채집하는 경우에는 레벨이 상승해.</div>,
              onClickContinue: () => {
                setTutorialModal({
                  show: true,
                  content: <div>레벨이 상승하면 더욱 강력해지고 시합에서 유리해져. 그리고 진화 가능레벨에 도달하면 진화를 할 수도 있어.</div>,
                  onClickContinue: () => {
                    setTutorialModal({
                      show: true,
                      content: <div>자, 이제 채집한 포켓몬을 확인한 후에 <span className='c-lightblue'>내 콜렉션</span>으로 이동해보자구!</div>,
                      onClickContinue: () => {
                        setUserPath(firebase, auth.uid, 'tutorialStep', 5)
                        .then(() => {
                          setTutorialModal({ show: false })
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  }
  componentWillUnmount () {
    const isClickedMix = this.props.pickMonInfo && this.props.pickMonInfo.mixCols && this.props.pickMonInfo.mixCols.length === 1
    if (isClickedMix) return // 채집 결과의 MonModal에서 교배하기 버튼 눌렀을 경우 예외처리
    else this.props.clearPickMonInfo()
  }
  _initPick () {
    const { pickMonInfo, firebase, auth, user } = this.props
    const { quantity, attrs, grades, evoluteCol, mixCols, isReward } = pickMonInfo
    if (!evoluteCol && !mixCols && !isReward && quantity > user.pickCredit) {  // 유저의 크레딧보다 더 많은 포켓몬을 채집하는 경우
      this.context.router.replace('pick-district')
      return
    }
    this.setState({ mode: quantity === 1 && (!evoluteCol || _.compact(evoluteCol.mon[evoluteCol.monId].next).length > 1) && !user.disableRoulette ? 'single' : 'multi' })
    let pickedMons = []
    const pickFuncArr = []
    if (!evoluteCol && !mixCols) { // 채집 또는 보상일때
      for (let i = 0; i < quantity; i++) {
        pickFuncArr.push(getPickMons(firebase, attrs, grades))
      }
      let dealCredit
      if (isReward) dealCredit = () => Promise.resolve()
      else dealCredit = () => refreshUserCredits(firebase, auth.uid, user).then(() => decreaseCredit(firebase, auth.uid, quantity, 'pick'))
      return dealCredit()
      .then(() => {
        return Promise.all(pickFuncArr)
      })
      .then(pickedMonsArr => {
        pickedMons = pickedMonsArr
        if (quantity === 1) {
          const picks = pickedMons[0]
          const pickedIdx = _.random(0, picks.length - 1)
          return postCollection(firebase, auth.uid, picks[pickedIdx], 'pick', null, user.colPoint)
            .then(result => {
              if (user.disableRoulette) {
                this.setState({ multiPicks: [result] })
                this._checkHonorGot()
              } else {
                this.setState({ picks, pickedIdx, result })
              }
              return Promise.resolve()
            })
        } else {
          const multiPicks = pickedMons.map(picks => picks[0])
          let results = []
          const postArr = multiPicks.map(pick => () => postCollection(firebase, auth.uid, pick, 'pick'))
          return postArr.reduce((prev, post) => prev.then(() => {
            return post()
              .then(result => {
                results.push(result)
                return Promise.resolve()
              })
          }), Promise.resolve())
          .then(() => {
            results = mergePickResults(results)
            this.setState({ multiPicks: results })
            return Promise.resolve()
          })
          .then(() => {
            this._checkHonorGot()
          })
        }
      })
      .catch(msg => {
        showAlert(msg)
        .then(() => {
          this.context.router.replace('/pick-district')
        })
      })
    } else if (mixCols) { // 교배일때
      getPickMons(firebase, allAttrs, getMixGrades(mixCols), mixCols) // 마지막 파라미터는 특정 포켓몬 교배 처리를 위함
      .then(picks => {
        const pickedIdx = _.random(0, picks.length - 1)
        return postCollection(firebase, auth.uid, picks[pickedIdx], 'mix', mixCols, user.colPoint)
        .then(result => {
          if (user.disableRoulette) {
            this.setState({ multiPicks: [result] })
            this._checkHonorGot()
          } else {
            this.setState({ picks, pickedIdx, result })
          }
          return Promise.resolve()
        })
      })
      // .catch(msg => {
      //   showAlert(msg)
      //     .then(() => {
      //       this.context.router.replace('/pick-district')
      //     })
      // })
    } else if (evoluteCol) { // 진화일때
      getNextMons(firebase, evoluteCol, auth.uid, user.colPoint)
      .then(nextMons => {
        const picks = _.compact(nextMons)
        if (picks.length > 1) { // 진화체가 여러개일 경우 단건채집과 같은방식으로 진행
          const pickedIdx = _.random(0, picks.length - 1)
          return postCollection(firebase, auth.uid, picks[pickedIdx], 'evolution', [evoluteCol], user.colPoint)
          .then(result => {
            this.setState({ picks, pickedIdx, result })
            return Promise.resolve()
          })
        } else { // 진화체가 하나인 경우 다건체집 화면
          const multiPicks = picks
          return postCollection(firebase, auth.uid, multiPicks[0], 'evolution', [evoluteCol])
          .then(result => {
            this.setState({ multiPicks: [result] })
            return Promise.resolve()
          })
          .then(() => {
            this._checkHonorGot()
          })
        }
      })
      .catch(msg => {
        showAlert(msg)
        .then(() => {
          this.context.router.replace('/pick-district')
        })
      })
    }
  }
  _handleOnClickContinue () {
    const { pickMonInfo, user, updatePickMonInfo } = this.props
    this.setState({ multiPicks: null })
    let pickMonInfoUpdater = () => Promise.resolve()
    if (this.state.mode === 'multi') {
      const newPickMonInfo = {
        quantity: user.pickCredit < pickMonInfo.quantity ? user.pickCredit : pickMonInfo.quantity,
        attrs: pickMonInfo.attrs,
        grades: ['b']
      }
      pickMonInfoUpdater = () => updatePickMonInfo(newPickMonInfo)
    }
    pickMonInfoUpdater()
    .then(() => {
      this.context.router.replace(`pick-mon?f=${keygen._()}`)
    })
  }
  _checkHonorGot () {
    if (this.props.pickMonInfo && this.props.pickMonInfo.mixCols && this.props.user.isTutorialOn && this.props.user.tutorialStep === 5) {
      const { setTutorialModal, firebase, auth } = this.props
      setTutorialModal({
        show: true,
        content: <div>마음에 드는 포켓몬이 탄생했어? 이렇게 교배를 통해서도 포켓몬을 얻을 수 있어! 하지만 포켓몬 두 마리를 희생해야 하니 마구잡이로 하면 안되겠지? 교배는 전략적으로 활용하자구.</div>,
        onClickContinue: () => {
          setTutorialModal({
            show: true,
            content: <div>이제 포켓몬을 모았으니, 포켓몬 세계를 탐험해볼까? 사이트메뉴의 <span className='c-lightblue'>포켓몬 탐험</span>메뉴를 눌러보자.</div>,
            onClickContinue: () => {
              setTutorialModal({ show: false })
              setUserPath(firebase, auth.uid, 'tutorialStep', 6)
            }
          })
        }
      })
    }
    // 새로운 포켓몬이 나오거나 포켓몬이 사라졌을 때 칭호가 비활성화 되거나 칭호를 새롭게 얻음
    const { user, showHonorModal, honors, userCollections, auth, firebase } = this.props
    let { gotHonors, enabledHonors } = user
    let tobeEnabledHonors = []
    let tobeGotHonors = []
    if (enabledHonors) tobeEnabledHonors = enabledHonors.slice()
    if (gotHonors) tobeGotHonors = gotHonors.slice()
    let isEnabledHonorsChanged = false
    let isTobeGotHonorsChanged = false
    const messages = []
    const honorsForModal = []
    const userCollectionsArr = convertMapToArr(userCollections[auth.uid])
    // 전체 honors에서 user의 colPoint보다 낮으면서 gotHonor에 없는 honor가 있는지 탐색
    // 전체 honors에서 user가 얻은 포켓몬 속성에 대해서만 user가 가진 해당 속성 콜렉션의 수와 비교
    // enabledHonor에서 user가 자격 미달인 honor가 있는지 탐색
    if (enabledHonors && enabledHonors.length > 0) {
      enabledHonors.forEach((honor, idx) => {
        if (honor.type === 1) {
          if (user.colPoint < honor.condition) {
            messages.push('콜렉션 점수 하락으로 아래 칭호가 해제되었습니다.')
            honorsForModal.push(honor)
            // TODO: enabledHonor 삭제 로직
            isEnabledHonorsChanged = true
            tobeEnabledHonors.splice(idx, 1)
          }
        } else {
          const attr = honor.attr
          if (countAttrsInCollections(attr, userCollectionsArr) < honor.condition) {
            messages.push('콜렉션 개체 수 하락으로 아래 칭호가 해제되었습니다.')
            honorsForModal.push(honor)
            // TODO: enabledHonor 삭제 로직
            isEnabledHonorsChanged = true
            tobeEnabledHonors.splice(idx, 1)
          }
        }
      })
    }
    let honorsNotGot
    if (gotHonors) honorsNotGot = honors.filter(honor => _.findIndex(gotHonors, gotHonor => gotHonor.id === honor.id) < 0)
    else {
      honorsNotGot = honors
      gotHonors = []
    }
    const honorsNotGotType1 = []
    const honorsNotGotType2 = []
    const updateUserHonorInfoProms = []
    let gotPokemoney = 0
    honorsNotGot.forEach(honor => {
      if (honor.type === 1) {
        honorsNotGotType1.push(honor)
      } else {
        honorsNotGotType2.push(honor)
      }
    })
    for (const honorNotGotType1 of honorsNotGotType1) {
      if (honorNotGotType1.condition < user.colPoint) {
        messages.push('콜렉션 점수 상승으로 아래 칭호를 획득했습니다.')
        if (honorNotGotType1.condition === 100) { // 100점 달성 시 추천인 포키머니 보상
          if (user.recommender) {
            gotPokemoney += 200
            updateUserHonorInfoProms.push(updateUserPokemoney(firebase, user.recommender.id, 500))
            window.swal('야호!', '추천인 코드 입력 보상으로 약속했던 추가 포키머니를 받았다!', 'success')
          }
        }
        honorsForModal.push(honorNotGotType1)
        isTobeGotHonorsChanged = true
        tobeGotHonors.push(honorNotGotType1)
      }
    }
    for (const honorNotGotType2 of honorsNotGotType2) {
      if (honorNotGotType2.condition < countAttrsInCollections(honorNotGotType2.attr, userCollectionsArr)) {
        messages.push('콜렉션 개체 수 상승으로 아래 칭호를 획득했습니다.')
        honorsForModal.push(honorNotGotType2)
        isTobeGotHonorsChanged = true
        tobeGotHonors.push(honorNotGotType2)
      }
    }
    if (isEnabledHonorsChanged) {
      updateUserHonorInfoProms.push(setUserPath(firebase, auth.uid, 'enabledHonors', tobeEnabledHonors))
    }
    if (isTobeGotHonorsChanged) {
      updateUserHonorInfoProms.push(setUserPath(firebase, auth.uid, 'gotHonors', tobeGotHonors))
      gotPokemoney += _.difference(tobeGotHonors, gotHonors).reduce((accm, honor) => {
        return accm + honor.reward
      }, 0)
      updateUserHonorInfoProms.push(updateUserPokemoney(firebase, auth.uid, gotPokemoney))
    }
    if (updateUserHonorInfoProms.length > 0) {
      Promise.all(updateUserHonorInfoProms)
      .then(() => {
        const honorModal = {
          messages, honors: honorsForModal
        }
        showHonorModal(honorModal)
      })
    }
  }
  render () {
    const { mode } = this.state
    const { user, pickMonInfo, auth, location, honorModal, hideHonorModal, messages, locale } = this.props
    if (!auth) return null
    const renderBtnComponent = () => {
      return (
        <div className='text-center'>
          <Button link text='채집구역선택' className='m-r-5'
            onClick={() => this.context.router.replace('pick-district')} />
          {user.pickCredit !== 0 && !pickMonInfo.evoluteCol && !pickMonInfo.mixCols && !pickMonInfo.isReward &&
            <Button className={user.isTutorialOn && user.tutorialStep === 4 ? 'blink-opacity' : null} text={`계속채집 X ${renderQuantity()}`} color='orange' onClick={this._handleOnClickContinue} />}
          {((user.pickCredit === 0 || pickMonInfo.evoluteCol || pickMonInfo.mixCols) || pickMonInfo.isReward) &&
            <Button className={user.isTutorialOn && user.tutorialStep === 5 ? 'blink-opacity' : null} text='내 콜렉션' color='green'
              onClick={() => this.context.router.replace(`collection/${auth.uid}`)} />}
        </div>
      )
    }
    const renderRoulette = () => {
      return (
        <div id='rouletteContainer' key={location.query.f}>
          <Roulette
            user={user}
            images={this.state.picks.map(pick => pick.mon[pick.monId].monImage[0].url)}
            stopIdx={this.state.pickedIdx}
            size={220}
            innerSize={200}
            id='roulette'
            style={{ margin: 'auto' }}
            stop={this.state.stop}
            delay={PICK_MON_ROULETTE_DELAY}
            mon={this.state.result}
            btnComponent={renderBtnComponent()}
            afterStop={this._checkHonorGot}
          />
        </div>
      )
    }
    const renderMultiPick = () => {
      const { multiPicks } = this.state
      let className = ''
      if (multiPicks.length === 4) className = 'col-md-offset-2'
      else if (multiPicks.length === 3) className = 'col-md-offset-3 col-sm-offset-1'
      else if (multiPicks.length === 2) className = 'col-md-offset-4 col-sm-offset-3'
      else if (multiPicks.length === 1) className = 'col-md-offset-5 col-sm-offset-4 col-xs-offset-3'
      else if (multiPicks.length === 5) className = 'col-md-offset-1'
      return multiPicks.map((pick, idx) => <MonCard mon={pick} pick user={user}
        className={idx === 0 ? className : null} key={idx} type='collection' />)
    }
    const renderQuantity = () => {
      if (mode === 'single') return 1
      else return user.pickCredit < pickMonInfo.quantity ? user.pickCredit : pickMonInfo.quantity
    }
    const renderBody = () => {
      return (
        <div className='text-center'>
          <h4>{getMsg(messages.pickMonView.yaho, locale)}<br />{getMsg(messages.pickMonView.curious, locale)}</h4>
          {this.state.pickedIdx > -1 && this.state.mode === 'single' && renderRoulette()}
          {
            this.state.multiPicks && this.state.mode === 'multi' &&
            <div>
              <div className='row m-t-30'>
                {renderMultiPick()}
              </div>
              <div className='row'>
                {renderBtnComponent()}
              </div>
            </div>
          }
          {
            ((this.state.pickedIdx < 0 && this.state.mode === 'single') ||
            (!this.state.multiPicks && this.state.mode === 'multi')) &&
            <Loading
              text='채집 중...'
              height={mode === 'single' ? 277 : 337}
            />
          }
          <HonorModal honorModalInfo={honorModal} close={hideHonorModal} />
        </div>
      )
    }
    return (
      <ContentContainer
        title='포켓몬 채집'
        body={renderBody()}
        key={this.props.location.f}
      />
    )
  }
}

PickMonView.contextTypes = {
  router: PropTypes.object.isRequired
}

PickMonView.propTypes = {
  firebase: PropTypes.object.isRequired,
  pickMonInfo: PropTypes.object,
  user: PropTypes.object,
  auth: PropTypes.object,
  location: PropTypes.object,
  updatePickMonInfo: PropTypes.func.isRequired,
  clearPickMonInfo: PropTypes.func.isRequired,
  showHonorModal: PropTypes.func.isRequired,
  hideHonorModal: PropTypes.func.isRequired,
  honorModal: PropTypes.object.isRequired,
  honors: PropTypes.array,
  userCollections: PropTypes.array,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default PickMonView
