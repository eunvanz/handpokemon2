import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

import Img from 'components/Img'
import HonorBadge from 'components/HonorBadge'

class UserInfo extends React.PureComponent {
  render () {
    const { user } = this.props
    const renderHonorBadges = () => {
      const { enabledHonors } = user
      if (!enabledHonors) return null
      return enabledHonors.map((honor, idx) => <HonorBadge key={idx} honor={honor} />)
    }
    return (
      <div className='row'>
        <div className='col-sm-4 col-xs-12 text-center' style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px' }}>
            <Img src={user.profileImage} width='100%'
              style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} />
          </p>
        </div>
        <div className='col-sm-8 col-xs-12'>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>닉네임</div>
            <div className='col-xs-9'>{user.nickname}</div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>칭호</div>
            <div className='col-xs-9'>
              {renderHonorBadges()}
            </div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>리그</div>
            <div className='col-xs-9'>
              {/* TODO */}
            </div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>콜렉션</div>
            <div className='col-xs-9'>
              <span className='c-lightblue f-700'>{numeral(user.colPoint).format('0,0')}</span>점 / <span className='c-lightblue f-700'>{numeral(user.colRank).format('0,0')}</span>위
              </div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>시합</div>
            <div className='col-xs-9'>
              <span className='c-lightblue f-700'>{numeral(user.leaguePoint).format('0,0')}</span>점 / <span className='c-lightblue f-700'>{numeral(user.leagueRank).format('0,0')}</span>위
              </div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-3 f-700'>시합전적</div>
            <div className='col-xs-9'>
              <span className='c-lightblue f-700'>{numeral(user.battleWin).format('0,0')}</span>승 <span className='c-lightblue f-700'>{numeral(user.battleLose).format('0,0')}</span>패
              </div>
          </div>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-12'>{user.introduce === '' ? '자기소개가 없습니다.' : user.introduce}</div>
          </div>
        </div>
      </div>
    )
  }
}

UserInfo.propTypes = {
  user: PropTypes.object
}

export default UserInfo
