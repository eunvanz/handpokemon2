import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import Slider from 'react-slick'
import { FormattedRelative } from 'react-intl'
import { toast } from 'react-toastify'
import { sortBy } from 'lodash'
import $ from 'jquery'
import LinesEllipsis from 'react-lines-ellipsis'

import { getMsg, isScreenSize, isStringLength, isIE } from 'utils/commonUtil'

import { VERSION } from 'constants/release'
import { colors } from 'constants/colors'

import Card from 'components/Card'
import WorkshopCard from 'components/WorkshopCard'
import ChatMessage from './ChatMessage'
import MonCard from 'components/MonCard'

import { postChat } from 'services/ChatService'

import Chat from 'models/chat'

const bannerTextStyle = (color) => {
  return ({
    backgroundColor: color,
    display: 'inline-block',
    color: 'white',
    padding: '2px 7px',
    fontSize: '18px'
  })
}

const bannerStyle = (color) => {
  return { height: '230px', maxWidht: '1140px', backgroundColor: color, padding: '10px', textAlign: 'center' }
}

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      chatContent: '',
      isChatLoading: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSendChat = this._handleOnClickSendChat.bind(this)
  }
  componentDidMount () {
    const { auth, user } = this.props
    let isSocialAccount = false
    if (auth && auth.providerData[0].providerId !== 'password') isSocialAccount = true
    if (isSocialAccount) {
      if (!user.nickname) {
        // 소셜계정이지만 아직 회원가입을 안했을 때의 처리
        this.context.router.push('sign-up')
      }
    }
    $('#chatContent').keypress((e) => {
      if (e.keyCode === 13 && $('#chatContent').val() !== '') {
        e.preventDefault()
        this._handleOnClickSendChat()
      }
    })
    this._initChatting()
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.chats !== this.props.chats) {
      window.$('#chatting-panel').mCustomScrollbar('scrollTo', '100%')
    }
  }
  componentWillUnmount () {
    const { firebase } = this.props
    firebase.unWatchEvent('value', 'works')
    firebase.unWatchEvent('value', 'chats')
  }
  _initChatting () {
    if (!$('#chatting-panel')) {
      setTimeout(() => this(), 500)
    } else {
      window.$('#chatting-panel').mCustomScrollbar({
        theme: 'minimal-dark',
        scrollInertia: 100,
        axis: 'yx',
        mouseWheel: {
          enable: true,
          axis: 'y',
          preventDefault: true
        },
        setTop: '100%'
      })
      window.$('#chatting-panel').mCustomScrollbar('scrollTo', '100%')
    }
  }
  _handleOnChangeInput (e) {
    const { name, value } = e.target
    if (isStringLength(value) > 100) return
    this.setState({ [name]: value })
  }
  _handleOnClickSendChat () {
    const { firebase, user, auth } = this.props
    const { chatContent } = this.state
    if (chatContent.length === 0) return
    this.setState({ isChatLoading: true })
    postChat(firebase, Object.assign({}, new Chat(), { writer: Object.assign({}, user, { id: auth.uid }), content: chatContent }))
    .then(() => {
      this.setState({ isChatLoading: false, chatContent: '' })
      window.$('#chatting-panel').mCustomScrollbar('scrollTo', '100%')
    })
  }
  render () {
    const { boards, locale, auth, works, user, chats, firebase, setUserModal, releaseInfo, messages } = this.props
    const { isChatLoading } = this.state
    const renderBanners = () => {
      const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
      }
      return (
        <div style={{ height: '230px' }}>
          <Slider {...settings}>
            <div className='card'>
              <div className='card-body'>
                <div style={bannerStyle(colors.amber)}>
                  <img src='https://firebasestorage.googleapis.com/v0/b/hand-pokemon-2.appspot.com/o/monImages%2F%E1%84%91%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%85%E1%85%B5.png?alt=media&token=e719c144-0e45-4307-ab02-7fa64ff9edf9'
                    style={{ width: '150px', display: 'inline-block' }}
                  /><br />
                  <div style={bannerTextStyle(colors.black)}>혹시..기다리셨나요?</div><br />
                  <div style={bannerTextStyle(colors.red)}>손켓몬이 돌아왔습니다.</div>
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='card-body'>
                <div style={bannerStyle(colors.lime)}>
                  <img src='https://firebasestorage.googleapis.com/v0/b/hand-pokemon-2.appspot.com/o/monImages%2F%E1%84%85%E1%85%AE%E1%84%87%E1%85%B3%E1%84%83%E1%85%A9.png?alt=media&token=2034a328-4296-49b9-8cae-3ae4135c0243'
                    style={{ width: '150px', display: 'inline-block' }}
                  /><br />
                  <div style={bannerTextStyle(colors.black)}>혹시..금손이세요?</div><br />
                  <div style={bannerTextStyle(colors.green)}>좀 해주셔야 할 일이..</div>
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='card-body'>
                <div style={bannerStyle(colors.lightGray)}>
                  <img src='https://firebasestorage.googleapis.com/v0/b/hand-pokemon-2.appspot.com/o/monImages%2Fdaktrio.png?alt=media&token=33188cfe-4c15-4e3a-ad78-1b0337b5fad5'
                    style={{ width: '150px', display: 'inline-block' }}
                  /><br />
                  <div style={bannerTextStyle(colors.black)}>성격이 급한편인가요?</div><br />
                  <div style={bannerTextStyle(colors.purple)}>친구들을 초대해보세요.</div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      )
    }
    const renderBoards = (category) => {
      return (
        <Card
          header={<h2>{category === 'notice' ? '최근 공지사항' : category === 'free' ? '최근 게시물' : '최근 가이드'}</h2>}
          body={boards[category].slice(0, 3).map((board) => {
            return (
              <div className='media' key={board.id} style={{ cursor: 'pointer' }} onClick={() => this.context.router.push(`/board-list/${category}/${board.id}`)}>
                <div className='media-body'>
                  <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>
                    <LinesEllipsis
                      text={board.title[locale]}
                      maxLine='1'
                      ellipsis='...'
                      trimRight
                      basedOn='letters'
                    />
                  </h2>
                  <small className='c-gray'>
                    by {board.writer.nickname}
                    <span> &#183; views: {board.views} &#183; likes: {board.likes} &#183; replies: {board.replies ? Object.keys(board.replies).length : 0}</span>
                  </small>
                </div>
              </div>
            )
          })}
        />
      )
    }
    const renderWorks = () => {
      return works.slice(0, isScreenSize.xs() ? 2 : 3).map((work) => {
        return (
          <WorkshopCard item={work} user={user} auth={auth} key={work.id}
            onClickLike={() => this.context.router.push('/workshop')}
            onClick={() => this.context.router.push('/workshop')}
            customClassName='col-xs-6 col-sm-4'
          />
        )
      })
    }
    const renderChats = () => {
      return chats.global.map(chat => <ChatMessage key={chat.id} chat={chat} firebase={firebase} setUserModal={setUserModal} auth={auth} side={auth && chat.writer.id === auth.uid ? 'right' : 'left'}
        timeComponent={<FormattedRelative value={new Date(chat.regDate)} />} />)
    }
    const renderNewMons = () => {
      const { mons } = this.props
      return sortBy(mons, mon => !mon.id).slice(0, isScreenSize.xs() ? 2 : 3).map((mon) => {
        return (
          <MonCard isNotMine key={mon.id} mon={{ asis: null, tobe: mon }} type='mon' isCustomSize className='col-xs-6 col-sm-4' />
        )
      })
    }
    return (
      <div className='container container-alt'>
        {
          isIE() &&
          <div className='row'>
            <div className='col-xs-12'>
              <div className='alert alert-danger'>인터넷 익스플로러로 접속하셨습니다. 이 브라우저는 호환성이 떨어집니다. 크롬이나 파이어폭스, 사파리로 접속하시는 걸 권장합니다.</div>
            </div>
          </div>
        }
        {
          releaseInfo.version > VERSION &&
          <div className='row'>
            <div className='col-xs-12'>
              <div className='alert alert-danger'>{getMsg(messages.common.isNotLatestVersion, locale)}</div>
            </div>
          </div>
        }
        <div className='row'>
          <div className='col-xs-12'>
            <div className='block-header'>
              <h1 style={{ fontSize: '20px' }}>한땀 한땀 수제 포켓몬을 모아보자!</h1>
            </div>
            {renderBanners()}
          </div>
        </div>
        <div className='row' style={{ marginTop: '30px' }}>
          <div className='col-md-6'>
            <Card
              header={<h2>최근 공작소 작품</h2>}
              body={
                <div className='row'>
                  {renderWorks()}
                </div>
              }
            />
            <Card
              header={<h2>최근 등록된 포켓몬</h2>}
              body={
                <div className='row'>
                  {renderNewMons()}
                </div>
              }
            />
          </div>
          <div className='col-md-6'>
            <div className='messages card' style={{ height: isScreenSize.xs() ? '400px' : '725px' }}>
              <div className='mb-list' style={{ height: isScreenSize.xs() ? '400px' : '725px' }}>
                <div id='chatting-panel' className='mbl-messages c-overflow mCustomScrollbar _mCS_4 mCS-autoHide'
                  style={{ position: 'relative', overflow: 'visible', padding: '20px 20px 0', height: isScreenSize.xs() ? '322px' : '647px' }}>
                  <div id='mCSB_4' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical_horizontal mCSB_outside' style={{ maxHeight: 'none' }} tabIndex='0'>
                    <div id='mCSB_4_container' className='mCSB_container mCS_x_hidden mCS_no_scrollbar_x' style={{ position: 'relative', top: '0px', left: '0px', width: '100%' }} dir='ltr'>
                      {renderChats()}
                    </div>
                  </div>
                </div>
                <div className='mbl-compose'>
                  <textarea placeholder={auth ? '메시지를 입력해주세요.' : '로그인을 해주세요.'} disabled={!auth} id='chatContent'
                    value={this.state.chatContent} onChange={this._handleOnChangeInput} name='chatContent'
                  />
                  <button disabled={!auth} onClick={this._handleOnClickSendChat}><i className={isChatLoading ? 'fa fa-sync fa-spin' : 'zmdi zmdi-mail-send'} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4'>
            {renderBoards('notice')}
          </div>
          <div className='col-md-4'>
            {renderBoards('free')}
          </div>
          <div className='col-md-4'>
            {renderBoards('guide')}
          </div>
        </div>
      </div>
    )
  }
}

HomeView.contextTypes = {
  router: PropTypes.object.isRequired
}

HomeView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  boards: PropTypes.object.isRequired,
  works: PropTypes.array.isRequired,
  chats: PropTypes.object,
  mons: PropTypes.array.isRequired,
  setUserModal: PropTypes.func.isRequired,
  releaseInfo: PropTypes.object.isRequired
}

export default HomeView

