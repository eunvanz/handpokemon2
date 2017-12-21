import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { getMsg } from 'utils/commonUtil'

import ContentContainer from 'components/ContentContainer'

import forKidultImg from './assets/art_1303782647.jpg'
import collectionImg from './assets/collecion.png'
import battleImg from './assets/battle.png'
import stageImg from './assets/stage.png'

class IntroduceView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div>
        <ContentContainer
          title='게임 소개'
          header={
            <h2>게임의 컨셉<small>손켓몬은 다음과 같은 컨셉으로 만들어졌습니다.</small></h2>
          }
          body={
            <div className='row'>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>FOR KIDULT</h3>
                <img src={forKidultImg} style={{ maxWidth: '250px', width: '100%', margin: '30px 0px' }} />
                <div>
                  따조를 기억하시나요? 띠부띠부실을 기억하시나요? 아직도 우리는 슈퍼마리오 장난감을 받기 위해 맥도날드에 줄을 서는 철부지 어른입니다. 손켓몬은 어릴 적 향수를 잊지 못하는 KIDULT들과 현역 청소년을 위한 게임입니다.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>PAINTER ART</h3>
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/hand-pokemon-2.appspot.com/o/monImages%2Fesanghaessi1.png?alt=media&token=70af2265-2271-44af-a56d-37460fb39f3c'
                  style={{ maxWidth: '200px', width: '100%', margin: '6px 0px' }}
                />
                <div>
                  손켓몬에서는 아마추어 그림판 아티스트들이 한땀 한땀 수작업으로 그려 탄생한 귀여운 포켓몬들을 모을 수 있습니다. 수 많은 그림판 아티스트들의 작품세계를 게임을 통해 만나보세요. 작품은 계속해서 업데이트 됩니다.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>FAN GAME</h3>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs03Pga0G-IZB6wnlejFN8e890r-Ny1BtAmlP7v0urB3rgp1sl'
                  style={{ maxWidth: '160px', width: '100%', margin: '22px 0px' }} />
                <div>
                  손켓몬은 Pokémon®의 정식 라이센스가 없는 순수 팬 게임입니다. 개발자 또한 바쁜 직장생활을 하며 짬짬이 운영 및 업데이트 하고 있기 때문에 상업성 게임의 퀄리티를 보장할 수 없습니다. 단, 무료로 마음껏 즐겨주세요!
                </div>
              </div>
            </div>
          }
        />
        <ContentContainer
          header={
            <h2>게임의 목표<small>손켓몬 트레이너 여러분들은 다음과 같은 목표를 달성해야 합니다.</small></h2>
          }
          body={
            <div className='row'>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>콜렉션 수집</h3>
                <img src={collectionImg} style={{ maxWidth: '250px', width: '100%', margin: '20px 0px' }} />
                <div>
                  손켓몬에는 계속해서 새로운 포켓몬들이 업데이트 되고 있습니다. 최고의 트레이너가 되기 위해서는 다양한 포켓몬들을 채집하고 진화시켜야 합니다. 여러분들만의 콜렉션을 완성하고 최고의 트레이너가 되어보세요.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>시합에서 승리</h3>
                <img src={battleImg} style={{ maxWidth: '250px', width: '100%', margin: '14px 0px' }} />
                <div>
                  손켓몬에서는 자신의 콜렉션을 이용해 다른 트레이너와 시합을 할 수 있습니다. 시합을 통한 보상으로 더욱 강력하고 희귀한 포켓몬들을 얻어낼 수도 있습니다. 포켓몬들을 육성하고 출전시켜 누가 진정한 포켓몬 챔피언인지 겨뤄보세요.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>포켓몬세계 탐험</h3>
                <img src={stageImg} style={{ maxWidth: '180px', width: '100%', margin: '14px 0px' }} />
                <div>
                  손켓몬에서는 트레이너들에게 항상 도전적인 과제를 던져주고 있습니다. 손켓몬 세계를 탐험하면서 스테이지를 클리어 해 나아가 보세요. 스테이지는 갈수록 더 어려워지지만 그에 따르는 보상 또한 점점 더 커집니다.
                </div>
              </div>
            </div>
          }
        />
        <ContentContainer
          header={
            <h2>게임의 특징<small>손켓몬은 다음과 같은 특징을 가지고 있고, 계속해서 추구해 나아가고 있습니다.</small></h2>
          }
          body={
            <div className='row'>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>NO STRESS</h3>
                <div>
                  머리를 쓸 필요도 없습니다. 복잡한 조작도 필요 없습니다. 손켓몬은 간단한 클릭 또는 터치 몇 번만으로 즐길 수 있습니다. 손켓몬은 남녀노소 누구나 쉽게 즐길 수 있는 게임을 지향합니다.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>NO WASTE TIME</h3>
                <div>
                  시간을 많이 들일 필요가 없습니다. 손켓몬은 짬짬이 3분 이내의 시간으로 충분히 즐길 수 있습니다. 아무리 바쁜 분들도 손켓몬에서는 게임을 지배하는 주인공이 될 수 있습니다.
                </div>
              </div>
              <div className='col-sm-4 text-center'>
                <h3 className='c-lightblue f-700'>CREATED BY USER</h3>
                <div>
                  여러분들과 함께 만들어갑니다. 손켓몬의 포켓몬들은 250x250 픽셀의 그림판 캔버스에서 탄생합니다. 포켓몬들은 제작자 뿐만 아니라 많은 유저들의 손 끝에서 만들어지고 있습니다.
                </div>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

IntroduceView.contextTypes = {
  router: PropTypes.object.isRequired
}

IntroduceView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default IntroduceView
