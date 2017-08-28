import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'
import WayPoint from 'react-waypoint'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import UserRankingCard from 'components/UserRankingCard'

import { getUserRanking } from 'services/UserService'

import { nullContainerHeight } from 'constants/styles'

class RankingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userList: null,
      page: 1,
      lastRank: 1
    }
  }
  shouldUpdateComponent (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  componentDidMount () {
    const { firebase, params } = this.props
    getUserRanking(firebase, params.type, 1)
    .then(userList => {
      this.setState({ userList })
    })
  }
  render () {
    const { params } = this.props
    const { type } = this.props.params
    const { userList, lastRank, page } = this.state
    const renderBody = () => {
      if (userList) {
        return (
          <div className='contacts clearfix row'>
            {
              userList.map((user, idx) => {
                return <UserRankingCard key={user.id} user={user} rank={(idx) * page} />
              })
            }
          </div>
        )
      } else {
        return <Loading text='랭킹정보를 불러오는 중...' height={nullContainerHeight} />
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
