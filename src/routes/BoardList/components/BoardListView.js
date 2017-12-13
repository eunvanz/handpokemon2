import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { toast } from 'react-toastify'
import { concat, findIndex } from 'lodash'

import { getMsg, isScreenSize } from 'utils/commonUtil'

import BoardElement from './BoardElement'
import Editor from './Editor'
import Button from 'components/Button'
import Selectbox from 'components/Selectbox'
import Loading from 'components/Loading'
import WaypointListContainer from 'components/WaypointListContainer'

import { getBoardList, getBoard } from 'services/BoardService'

class BoardListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      boardList: props.boards,
      page: 1,
      lastRegDate: null,
      lastBoardId: null,
      isLoading: true,
      isLastPage: false,
      boardToEdit: null,
      isRefreshing: false
    }
    this._handleOnClickRefresh = this._handleOnClickRefresh.bind(this)
    this._handleOnCompleteSave = this._handleOnCompleteSave.bind(this)
    this._init = this._init.bind(this)
    this._loadMoreItems = this._loadMoreItems.bind(this)
    this._handleOnChangeElement = this._handleOnChangeElement.bind(this)
    this._handleOnClickEdit = this._handleOnClickEdit.bind(this)
  }
  componentDidMount () {
    this._init()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.category !== this.props.params.category) {
      this._init()
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { firebase } = this.props
    firebase.unWatchEvent('value', 'boards')
  }
  _init () {
    const { category } = this.props.params
    const { firebase } = this.props
    window.scrollTo(0, 0)
    return getBoardList(firebase, category, 1)
      .then(boardList => {
        const lastBoard = boardList[boardList.length - 1]
        this.setState({
          boardList,
          lastRegDate: lastBoard.regDate,
          lastBoardId: lastBoard.id,
          isLoading: false,
          page: 1,
          isLastPage: false
        })
        return Promise.resolve()
      })
  }
  _loadMoreItems () {
    const { page, lastRegDate, lastBoardId, boardList, isLastPage } = this.state
    const { category } = this.props.params
    if (isLastPage) return
    this.setState({ isLoading: true })
    const { firebase } = this.props
    getBoardList(firebase, category, page + 1, lastRegDate, lastBoardId)
      .then(boardListToAdd => {
        if (boardListToAdd.length === 0) {
          this.setState({ isLastPage: true, isLoading: false })
          return
        }
        const lastBoard = boardListToAdd[boardListToAdd.length - 1]
        this.setState({
          page: page + 1,
          boardList: concat(boardList, boardListToAdd),
          isLoading: false,
          lastRegDate: lastBoard.regDate,
          lastBoardId: lastBoard.id
        })
      })
  }
  _handleOnClickRefresh () {
    this.setState({ isRefreshing: true })
    this._init()
    .then(() => {
      this.setState({ isRefreshing: false })
    })
  }
  _handleOnCompleteSave () {
    const { messages, locale } = this.props
    this._init()
    toast(getMsg(messages.board.saveSuccess, locale))
  }
  _handleOnChangeElement (board) {
    const { firebase } = this.props
    const { boardList } = this.state
    getBoard(firebase, board.category, board.id)
    .then(newBoard => {
      const idx = findIndex(boardList, e => {
        if (!e) return false
        return e.id === board.id
      })
      const newBoardList = boardList.slice()
      newBoardList[idx] = newBoard || null
      this.setState({ boardList: newBoardList })
    })
  }
  _handleOnClickEdit (board) {
    this.setState({ boardToEdit: board })
    window.scrollTo(0, 0)
  }
  render () {
    const { messages, locale, auth, user, firebase } = this.props
    const { category } = this.props.params
    const { boardList, isLastPage, isLoading, boardToEdit, isRefreshing } = this.state
    const renderList = () => {
      if (!boardList) return <div />
      return boardList.map(board => {
        if (!board) return
        return (
          <BoardElement
            key={board.id}
            board={board}
            user={user}
            auth={auth}
            messages={messages}
            firebase={firebase}
            locale={locale}
            onChangeElement={() => this._handleOnChangeElement(board)}
            onClickEdit={() => this._handleOnClickEdit(board)}
          />
        )
      })
    }
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='block-header'>
          <h1 style={{ fontSize: '20px' }}>{getMsg(messages.board[category], locale)}</h1>
          <ul className='actions'>
            <li className='m-l-10'><a onClick={this._handleOnClickRefresh} style={{ cursor: 'pointer' }}><i className={`fa fa-sync${ isRefreshing ? ' fa-spin' : ''}`} /></a></li>
          </ul>
        </div>
        <div className='row wall' style={{ margin: isScreenSize.sm() || isScreenSize.xs() ? '0px' : null }}>
          {
            (user && category !== 'notice' || (category === 'notice' && user && user.authorization === 'admin')) &&
            <div className='col-xs-12' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
              <Editor category={category} onClickCancel={() => this.setState({ boardToEdit: null })} board={boardToEdit} firebase={firebase} locale={locale} messages={messages} user={user} auth={auth} onCompleteSave={this._handleOnCompleteSave} />
            </div>
          }
          <WaypointListContainer
            elements={renderList()}
            onLoad={this._loadMoreItems}
            isLastPage={isLastPage}
            isLoading={isLoading}
            loadingText={getMsg(messages.board.loadingBoards, locale)}
          />
        </div>
      </div>
    )
  }
}

BoardListView.contextTypes = {
  router: PropTypes.object.isRequired
}

BoardListView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  boards: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
}

export default BoardListView
