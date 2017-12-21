import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import GeneralRoulette from 'components/GeneralRoulette'
import Img from 'components/Img'
import MonUnit from './MonUnit'

import { isScreenSize, getMsg } from 'utils/commonUtil'

import { colors } from 'constants/colors'
import { fontSizeByDamage } from 'constants/styles'

import specialImage from './assets/fire.svg'
import normalImage from './assets/paw.png'
import battleRouletteImage from './assets/battleRoulette.png'

const rouletteStyle = {
  border: `3px solid ${colors.lightGray}`, borderRadius: isScreenSize.xs() ? '5px' : '10px', margin: 'auto'
}

class BattleStage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enemyPicks: props.battleLog.enemyPicks,
      userPicks: props.battleLog.userPicks
    }
    this._initAnimation = this._initAnimation.bind(this)
    this._initRoulette = this._initRoulette.bind(this)
  }
  componentDidMount () {
    const { user, setTutorialModal } = this.props
    if (user.isTutorialOn && user.tutorialStep === 6) {
      setTutorialModal({
        show: true,
        content: <div>시합은 자동으로 진행이 돼. 내 포켓몬들이 잘 싸우는지 관전만 하면 된다구. 그래도 <span className='c-lightblue'>룰렛</span>의 의미를 알아야겠지?</div>,
        onClickContinue: () => {
          setTutorialModal({
            show: true,
            isHiddenImg: true,
            content: (
              <div>
                <div className='row'>
                  <div className='col-xs-12 text-center'>
                    <img src={battleRouletteImage} />
                  </div>
                </div>
                <div>오박사님의 룰렛을 살펴볼까? 첫번째 룰렛은 <span className='c-lightblue'>공격 포켓몬</span>을 뜻해. 두번째 룰렛은 <span className='c-lightblue'>수비 포켓몬</span>, 세번째 룰렛은 <span className='c-lightblue'>공격 타입</span>을 뜻하지.</div>
              </div>
            ),
            onClickContinue: () => {
              setTutorialModal({
                show: true,
                isHiddenImg: true,
                content: (
                  <div>
                    <div className='row'>
                      <div className='col-xs-12 text-center'>
                        <img src={battleRouletteImage} />
                      </div>
                    </div>
                    <div>이 룰렛의 결과로 보면 오박사님의 <span className='c-lightblue'>소미안</span>이 너의 <span className='c-lightblue'>꾸꾸리</span>를 <span className='c-lightblue'>일반공격</span>으로 공격하게 돼있어.</div>
                  </div>
                ),
                onClickContinue: () => {
                  setTutorialModal({
                    show: true,
                    isHiddenImg: true,
                    content: (
                      <div>
                        <div className='row'>
                          <div className='col-xs-12 text-center'>
                            <img src={battleRouletteImage} />
                          </div>
                        </div>
                        <div>세번째 룰렛에는 <span className='c-lightblue'>발바닥</span>과 <span className='c-lightblue'>불꽃모양</span>이 있는데, 불꽃모양은 <span className='c-lightblue'>특수공격</span>을 의미해. <span className='c-lightblue'>1/3확률</span>로 특수공격이 발동하지.</div>
                      </div>
                    ),
                    onClickContinue: () => {
                      setTutorialModal({
                        show: true,
                        content: (
                          <div>시합 속도를 조절하고 싶으면 <span className='c-lightblue'>화면 아래쪽의 슬라이드바</span>로 속도를 조절해봐. 자, 그럼 관전을 시작해보자!</div>
                        ),
                        onClickContinue: () => {
                          setTutorialModal({ show: false })
                          this._initStage()
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    } else {
      this._initStage()
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initStage () {
    const { user } = this.props
    const $ = window.$
    setTimeout(() => {
      const headerHeight = $('#header').height()
      const controllerHeight = $('#enemyController>div').height()
      const unitHeight = $('#enemy-0').height()
      const spaceHeight = window.innerHeight - headerHeight - (controllerHeight * 2) - (unitHeight * 2) - 220
      $('#space').animate({
        height: spaceHeight
      }, 100)

      const slider = document.getElementById('speedSlider')
      slider.style.width = '90%'
      slider.style.margin = '30px auto 0px'
      const noUiSlider = window.noUiSlider
      noUiSlider.create(slider, {
        start: user.battleSpeed || 1,
        connect: 'lower',
        range: {
          'min': 1,
          'max': 10
        },
        step: 0.5
      })

      setTimeout(() => this._initAnimation(), 100)
    }, 100)
  }
  _initAnimation () {
    const { battleLog, onClickNext, messages, locale } = this.props
    const { damages } = this.state
    const $ = window.$
    const monSize = $('#user-1 img').width()
    const movementSpeed = 800
    const afterAttackDelay = 200
    const damageSpeed = 1200
    const infoSpeed = 600
    const termToNext = 800
    const guageSpeed = 200
    const avoidSpeed = 50
    const termForRoulette = 400
    const runTurn = idx => {
      const turn = battleLog.turns[idx]
      const slider = document.getElementById('speedSlider')
      const speed = slider.noUiSlider.get()
      const speedVar = 1 / speed
      const rouletteSpeed = 10 * speed > 20 ? 20 : 10 * speed
      const rouletteDelay = 1 * speedVar
      this.setState({ damages: Object.assign({}, damages, { speed: damageSpeed * speedVar }) })
      let { attacker, defender, attackerIdx, defenderIdx, attackType, finalDamage, defenderPick, attackerPick } = turn

      const animateAttack = () => {
        const attackerUnit = $(`#${attacker}-${attackerIdx}`)
        const defenderUnit = $(`#${defender}-${defenderIdx}`)
        const defenderImage = $(`#${defender}-${defenderIdx} img`)
        const attackerPosition = { top: attackerUnit.position().top, left: attackerUnit.position().left }
        const defenderPosition = { top: defenderUnit.position().top, left: defenderUnit.position().left }
        const offsetTop = defenderPosition.top - attackerPosition.top
        const offsetLeft = defenderPosition.left - attackerPosition.left

        let movementDelay = termForRoulette * speedVar
        let specialDelay = 0

        // 상성보너스 표시 애니메이션
        if (turn.attrBonus !== '0%') {
          specialDelay += infoSpeed * speedVar + infoSpeed * 2 * speedVar
          movementDelay += specialDelay
          const bonusNumber = Number(_.replace(turn.attrBonus, '%', ''))
          const textColor = bonusNumber > 0 ? colors.blue : colors.red
          const attrBonusInfoDiv = $(`#${attacker}-${attackerIdx}-attrBonusInfo`)
          attrBonusInfoDiv.css('top', isScreenSize.xs() ? -25 : -30).css('color', textColor).css('opacity', 1)
          .text(`${bonusNumber > 0 ? '+' : ''}${turn.attrBonus}`)
          setTimeout(() => {
            attrBonusInfoDiv.animate({ opacity: 0 }, infoSpeed * speedVar)
          }, infoSpeed * 2 * speedVar)
        }

        // 특수기술명 표시 애니메이션
        if (turn.attackType === 2) {
          movementDelay += infoSpeed * speedVar + infoSpeed * 2 * speedVar
          setTimeout(() => {
            const specialInfo = $(`#${attacker}-${attackerIdx}-specialInfo`)
            specialInfo.css('top', 0).css('fontSize', '14px')
            specialInfo
              .css({ opacity: 1, top: isScreenSize.xs() ? -25 : -30 })
              .effect('pulsate')
            setTimeout(() => {
              specialInfo.animate({ opacity: 0 }, infoSpeed * speedVar)
            }, infoSpeed * 2 * speedVar)
          }, specialDelay)
        }
        
        setTimeout(() => {
          // 공격 후 돌아오는 애니메이션
          attackerUnit
            .animate({ top: offsetTop - ((monSize / 1.5) * (attacker === 'user' ? -1 : 1)), left: offsetLeft === 0 ? offsetLeft : offsetLeft > 0 ? offsetLeft - (monSize / 1.5) : offsetLeft + (monSize / 1.5) }, movementSpeed * speedVar, 'easeInCirc')
            .delay(afterAttackDelay * speedVar)
            .animate({ top: 0, left: 0 }, movementSpeed * speedVar, 'easeOutCirc')
          
          // 다음 턴 실행
          setTimeout(() => {
            if (idx + 1 < battleLog.turns.length) {
              runTurn(idx + 1)
            } else {
              const type = battleLog.winner === 'user' ? 'success' : 'error'
              const title = battleLog.winner === 'user' ? getMsg(messages.battleView.goodjob, locale) : getMsg(messages.battleView.lost, locale)
              const html = getMsg(messages.battleView.winnerIs, locale).replace('{name}', `<span class="c-blue f-700" style="font-size: 16px;">${this.props[battleLog.winner].nickname}</span>`)
              window.swal({ title, html, confirmButtonText: '확인', type })
              .then(() => onClickNext(speed)).catch(() => onClickNext(speed))
            }
          }, (2 * movementSpeed + afterAttackDelay + termToNext) * speedVar)
  
          setTimeout(() => {
            if (turn.isAvoid) {
              // 피하기 애니메이션
              defenderUnit.animate({ left: isScreenSize.xs() ? -40 : -80 }, avoidSpeed * speedVar)
                .delay(afterAttackDelay * speedVar)
                .animate({ left: 0 }, avoidSpeed * speedVar)
            } else {
              // 타격당할 때 에니메이션
              if (turn.finalDamage < 300) {
                defenderImage.effect('bounce', 'fast')
              } else {
                $('body').effect('bounce', 'fast')
              }

              // 데미지 표시 에니메이션
              const damageInfoDiv = $(`#${defender}-${defenderIdx}-damageInfo`)
              damageInfoDiv.css('top', 0).css('fontSize', '16px')
              damageInfoDiv
                .text(-1 * finalDamage)
                .animate({ opacity: 1, top: isScreenSize.xs() ? -30 : -40, fontSize: fontSizeByDamage(finalDamage) }, damageSpeed * speedVar)
              setTimeout(() => {
                damageInfoDiv.animate({ opacity: 0 }, damageSpeed * speedVar)
              }, damageSpeed * speedVar)
  
              // 게이지 변화 애니메이션
              const restGuage = $(`#${defender}-${defenderIdx}-hpGuage .restHp`)
              const restPercent = defenderPick.restHp * 100 / defenderPick.totalHp
              restGuage.animate({ width: `${restPercent}%` }, guageSpeed * speedVar)
  
              // hp 텍스트 변경
              $(`#${defender}-${defenderIdx} .restHpText`).text(` ${defenderPick.restHp}`)
  
              // 죽었을 경우
              if (turn.afterHp === 0) {
                defenderUnit.css('opacity', 0.3)
              }
            }
          }, movementSpeed * speedVar)
        }, movementDelay) // 보너스 상성이 표기된 후 공격 시작
      }

      // 룰렛 시작
      this._initRoulette(`${attacker}Roulette-1`, attackerIdx, rouletteSpeed, rouletteDelay, undefined, idx)
      this._initRoulette(`${attacker}Roulette-2`, defenderIdx, rouletteSpeed, rouletteDelay, undefined, idx)
      this._initRoulette(`${attacker}Roulette-3`, attackType, rouletteSpeed, rouletteDelay, animateAttack, idx)
      setTimeout(() => $(`#${attacker}Roulette-1`).roulette('start'), 100 * speedVar)
      setTimeout(() => $(`#${attacker}Roulette-2`).roulette('start'), 300 * speedVar)
      setTimeout(() => $(`#${attacker}Roulette-3`).roulette('start'), 500 * speedVar)
    }
    runTurn(0)
  }
  _initRoulette (rouletteId, stopIdx, speed, duration, stopCallback, turn) {
    const option = {
      speed,
      duration: turn < 2 ? 1 : duration,
      stopImageNumber: stopIdx,
      stopCallback: stopCallback
    }
    const rouletteDiv = window.$(`#${rouletteId}`)
    if (turn < 2) {
      rouletteDiv.roulette(option)
    } else {
      rouletteDiv.roulette('option', option)
    }
  }
  render () {
    const { user, enemy, userPicks, enemyPicks, locale } = this.props
    const renderController = type => {
      let myself = enemy
      let myPicks = enemyPicks
      let otherPicks = userPicks
      if (type === 'user') {
        myself = user
        myPicks = userPicks
        otherPicks = enemyPicks
      }
      return (
        <div id={`${type}Controller`}>
          {
            type === 'user' &&
            <div className='col-md-1 col-sm-2 col-xs-3 col-md-offset-4 col-sm-offset-2'>
              <p style={{ marginBottom: '10px' }}>
                <Img src={myself.profileImage} className='mCS_img_loaded'
                  style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50px' : isScreenSize.smallerThan('md') ? '70px' : '80px', borderRadius: '50%' }} />
              </p>
            </div>
          }
          <div className={`col-md-1 col-sm-2 col-xs-3${type === 'enemy' ? ' col-md-offset-4 col-sm-offset-2' : ''}`}>
            <GeneralRoulette
              images={myPicks.map(p => p.mon[p.monId].monImage[p.imageSeq].url)}
              id={`${type}Roulette-1`}
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
              innerSize={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
            />
          </div>
          <div className='col-md-1 col-sm-2 col-xs-3'>
            <GeneralRoulette
              images={otherPicks.map(p => p.mon[p.monId].monImage[p.imageSeq].url)}
              id={`${type}Roulette-2`}
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
              innerSize={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
            />
          </div>
          <div className='col-md-1 col-sm-2 col-xs-3'>
            <GeneralRoulette
              images={[normalImage, normalImage, specialImage]}
              id={`${type}Roulette-3`}
              style={rouletteStyle}
              size={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
              innerSize={isScreenSize.xs() ? 50 : isScreenSize.smallerThan('md') ? 70 : 80}
            />
          </div>
          {
            type === 'enemy' &&
            <div className='col-md-1 col-sm-2 col-xs-3'>
              <p style={{ marginBottom: '10px' }}>
                <Img src={myself.profileImage} className='mCS_img_loaded'
                  style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50px' : '80px', borderRadius: '50%' }} />
              </p>
            </div>
          }
        </div>
      )
    }
    const renderMons = (picks, type) => {
      return picks.map((pick, idx) => {
        return (
          <MonUnit mon={pick} key={idx} id={`${type}-${idx}`} user={pick.user} locale={locale} />
        )
      })
    }
    const renderBody = () => {
      return (
        <div>
          <div className='row text-center m-b-30'>
            {renderController('enemy')}
          </div>
          <div className='row'>
            {renderMons(this.state.enemyPicks, 'enemy')}
          </div>
          <div id='space' />
          <div className='row'>
            {renderMons(this.state.userPicks, 'user')}
          </div>
          <div className='row text-center m-t-30'>
            {renderController('user')}
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div id='speedSlider' className='input-slider' />
            </div>
          </div>
        </div>
      )
    }
    return (
      <ContentContainer
        body={renderBody()}
      />
    )
  }
}

BattleStage.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleStage.propTypes = {
  battleLog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userPicks: PropTypes.array.isRequired,
  enemy: PropTypes.object.isRequired,
  enemyPicks: PropTypes.array.isRequired,
  onClickNext: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default BattleStage
