import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import Img from 'components/Img'

import { levelBadgeStyle } from 'constants/styles'
import { colors } from 'constants/colors'

class UserRankingCard extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  render () {
    const { user, rank, isMyself } = this.props
    return (
      <div className='col-md-2 col-sm-3 col-xs-6'>
        <div className='c-item' style={{ borderColor: isMyself ? colors.amber : '#e2e2e2' }}>
          <div style={Object.assign({}, levelBadgeStyle, { position: 'absolute', top: '0px', margin: '0px -1px', borderRadius: '0px 0px 2px 0px', backgroundColor: colors.lightBlue })}>{rank}위</div>
          <div className='ci-avatar'>
            <Img src={user.profileImage} />
          </div>
          <div className='c-info' style={{ margin: '5px 0px' }}>
            <strong>{user.nickname}</strong>
            <small><span className='c-lightblue'>{user.colPoint}</span>점</small>
          </div>
        </div>
      </div>
    )
  }
}

UserRankingCard.contextTypes = {
  router: PropTypes.object.isRequired
}

UserRankingCard.propTypes = {
  user: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  isMyself: PropTypes.bool
}

export default UserRankingCard
