import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import numeral from 'numeral'

import UserModal from 'components/UserModal'
import Img from 'components/Img'
import Button from 'components/Button'
import HonorBadge from 'components/HonorBadge'

import { isScreenSize, getHonorBurf, getHonorBurfTotal } from 'utils/commonUtil'

class UserInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showUserModal: false
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { showUserModal } = this.state
    const { isHidden, isChosen, user, onClickChoose, onClickNext, picks, isForResult } = this.props
    return (
      <div className='text-center'>
        {
          !isHidden && isChosen &&
          <UserModal key={user.nickname} user={user} show={showUserModal}
            close={() => this.setState({ showUserModal: false })} />
        }
        <p style={{ marginBottom: '10px' }}>
          <Img src={user.profileImage} className='mCS_img_loaded'
            onClick={!isHidden && isChosen ? () => this.setState({ showUserModal: true }) : () => { }}
            style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50%' : '70%', borderRadius: '50%', cursor: !isHidden && isChosen ? 'pointer' : null }} />
        </p>
        <p className='m-b-10'>{user.nickname}</p>
        {
          (isHidden || (!isHidden && !isChosen)) && !isForResult &&
          <p className='m-b-30' style={{ minHeight: '22px' }}>{user.enabledHonors && user.enabledHonors.map((honor, idx) => <HonorBadge key={idx} honor={honor} />)}</p>
        }
        {
          ((!isHidden && isChosen) || isForResult) &&
          <p className='m-b-30' style={{ minHeight: '22px' }}>총 전투력: <span className='c-blue f-700'>{numeral(picks.reduce((accm, defender) => accm + defender.total + defender.addedTotal, 0) + 3 * getHonorBurfTotal(getHonorBurf(user))).format('0,0')}</span></p>
        }
        {
          isHidden &&
          <Button text='선택' size='xs' block color='orange' onClick={onClickChoose} />
        }
        {
          !isHidden && isChosen &&
          <Button text='다음단계로' size='xs' block color='green' onClick={onClickNext} />
        }
        {
          !isHidden && !isChosen && !isForResult &&
          <Button text='선택' size='xs' block color='orange' disabled />
        }
        {
          isForResult &&
          <div>
            <p className='m-b-0'>순위: <span className='c-lightblue f-700'>{numeral(user.leagueRank).format('0,0')}</span></p>
            <p className='m-b-0'>점수: <span className='c-lightblue f-700'>{numeral(user.leaguePoint).format('0,0')}</span></p>
          </div>
        }
      </div>
    )
  }
}

UserInfo.contextTypes = {
  router: PropTypes.object.isRequired
}

UserInfo.propTypes = {
  isHidden: PropTypes.bool,
  isChosen: PropTypes.bool,
  user: PropTypes.object.isRequired,
  onClickChoose: PropTypes.func,
  onClickNext: PropTypes.func,
  picks: PropTypes.array,
  isForResult: PropTypes.bool
}

export default UserInfo
