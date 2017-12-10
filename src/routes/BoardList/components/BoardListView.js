import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { getMsg, isScreenSize } from 'utils/commonUtil'

import BoardElement from './BoardElement'
import Editor from './Editor'
import Button from 'components/Button'
import Selectbox from 'components/Selectbox'

class BoardListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      boardList: props.boards
    }
    this._handleOnClickRefresh = this._handleOnClickRefresh.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { firebase } = this.props
    firebase.unWatchEvent('value', 'boards')
  }
  _handleOnClickRefresh () {
    const { boards } = this.props
    this.setState({ boardList: boards })
  }
  render () {
    const { messages, locale, auth, user, firebase } = this.props
    const { boardList } = this.state
    const renderList = () => {
      return boardList.map(board => {
        return (
          <BoardElement
            key={board.id}
            board={board}
            user={user}
            auth={auth}
            messages={messages}
            locale={locale}
          />
        )
      })
    }
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='block-header'>
          <h1 style={{ fontSize: '20px' }}>{getMsg(messages.board.board, locale)}</h1>
          <ul className='actions'>
            <li className='m-l-10'><a onClick={this._handleOnClickRefresh} style={{ cursor: 'pointer' }}><i className='fa fa-sync' /></a></li>
          </ul>
        </div>
        <div className='row wall' style={{ margin: isScreenSize.sm() || isScreenSize.xs() ? '0px' : null }}>
          <div className='col-xs-12' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
            <Editor firebase={firebase} locale={locale} messages={messages} user={user} auth={auth} />
          </div>
          {renderList()}
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
  boards: PropTypes.array.isRequired
}

export default BoardListView
