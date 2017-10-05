import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import ListContainer from 'components/ListContainer'
import RankingElement from 'components/RankingElement'
import RankingHeader from 'components/RankingHeader'

import { getUserRanking, getUserRankingByUserId } from 'services/UserService'

import { nullContainerHeight } from 'constants/styles'

class RankingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userList: null,
      page: 1,
      lastColPoint: null,
      lastUserId: null,
      isLoading: true,
      isLastPage: false,
      userRank: null
    }
    this._loadMoreItems = this._loadMoreItems.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentDidMount () {
    const { firebase, params, auth } = this.props
    getUserRanking(firebase, params.type, 1)
    .then(userList => {
      const lastUser = userList[userList.length - 1]
      this.setState({ userList, lastColPoint: lastUser.colPoint, lastUserId: lastUser.id, isLoading: false })
      return Promise.resolve()
    })
    .then(() => {
      if (auth) {
        return getUserRankingByUserId(firebase, params.type, auth.uid)
        .then(userRank => {
          this.setState({ userRank })
        })
      }
    })
  }
  _loadMoreItems () {
    const { page, lastColPoint, lastUserId, userList, lastRank, isLastPage } = this.state
    if (isLastPage) return
    this.setState({ isLoading: true })
    const { firebase, params } = this.props
    getUserRanking(firebase, params.type, page + 1, lastColPoint, lastUserId)
    .then(userListToAdd => {
      if (userListToAdd[0].id === userList[0].id) {
        this.setState({ isLastPage: true, isLoading: false })
        return
      }
      const lastUser = userListToAdd[userListToAdd.length - 1]
      this.setState({
        page: page + 1,
        lastRank: lastRank + userListToAdd.length,
        userList: _.concat(userList, userListToAdd),
        isLoading: false,
        lastColPoint: lastUser.colPoint,
        lastUserId: lastUser.id
      })
    })
  }
  render () {
    const { type } = this.props.params
    const { user } = this.props
    const { userList, isLoading, isLastPage, userRank } = this.state
    const renderElements = () => {
      if (!userList) return null
      const returnComponent = []
      if (userRank) {
        returnComponent.push(
          <RankingElement user={user} rank={userRank} key={-1} type={type} isMine />
        )
      }
      return returnComponent.concat(userList.map((user, seq) => {
        return (
          <RankingElement user={user} rank={seq + 1} key={seq} type={type} />
        )
      }))
    }
    const renderHeader = () => {
      return <RankingHeader type={type} />
    }
    const renderBody = () => {
      if (userList) {
        return (
          <ListContainer
            elements={renderElements()}
            isLoading={isLoading}
            onLoad={this._loadMoreItems}
            isLastPage={isLastPage}
            header={renderHeader()}
          />
        )
      } else {
        return <Loading text='랭킹목록을 불러오는 중...' height={nullContainerHeight} />
      }
    }
    return (
      <ContentContainer
        title={`${type === 'collection' ? '콜렉션' : '시합'} 랭킹`}
        body={renderBody()}
        clearPadding
      />
    )
  }
}

RankingView.contextTypes = {
  router: PropTypes.object.isRequired
}

RankingView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  params: PropTypes.object
}

export default RankingView
