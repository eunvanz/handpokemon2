import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'
import WayPoint from 'react-waypoint'
import keygen from 'keygenerator'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import UserRankingCard from 'components/UserRankingCard'
import _ from 'lodash'

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
  shouldUpdateComponent (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
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
    this.setState({ isLoading: true })
    const { firebase, params } = this.props
    const { page, lastColPoint, lastUserId, userList, lastRank } = this.state
    getUserRanking(firebase, params.type, page + 1, lastColPoint, lastUserId)
    .then(userListToAdd => {
      if (userListToAdd[0].id === userList[0].id) {
        this.setState({ isLastPage: true })
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
    const { user } = this.props
    const { type } = this.props.params
    const { userList, isLoading, isLastPage, userRank } = this.state
    const renderWayPoint = () => {
      return (
        <div className='col-xs-12'>
          { !isLoading && !isLastPage &&
            <WayPoint onEnter={this._loadMoreItems} />
          }
          {!isLastPage && isLoading && <Loading height={50} />}
        </div>
      )
    }
    const renderPage = () => {
      return (
        <div>
          { userRank && <UserRankingCard user={user} rank={userRank} isMyself /> }
          {
            userList.map((rankUser, idx) => {
              return <UserRankingCard key={keygen._()} user={rankUser} rank={1 + idx} />
            })
          }
        </div>
      )
    }
    const renderBody = () => {
      if (userList) {
        return (
          <div className='contacts clearfix row'>
            {renderPage()}
            {renderWayPoint()}
          </div>
        )
      } else {
        return <Loading text='랭킹목록을 불러오는 중...' height={nullContainerHeight} />
      }
    }
    return (
      <ContentContainer
        title={`${type === 'collection' ? '콜렉션' : '시합'} 랭킹`}
        body={renderBody()}
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
