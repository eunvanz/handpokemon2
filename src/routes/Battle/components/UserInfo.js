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
    const { isHidden, isChosen, user, onClickChoose, onClickNext, picks, isForResult, attrBonusInfo, battleResultInfo } = this.props
    return (
      <div className='text-center'>
        {
          !isHidden && (isChosen || isForResult) &&
          <UserModal key={user.nickname} user={user} show={showUserModal} showCollectionButton={isForResult}
            close={() => this.setState({ showUserModal: false })} />
        }
        <p style={{ marginBottom: '10px' }}>
          <Img src={user.profileImage} className='mCS_img_loaded'
            onClick={!isHidden && (isChosen || isForResult) ? () => this.setState({ showUserModal: true }) : () => { }}
            style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50%' : '70%', borderRadius: '50%', cursor: !isHidden && (isChosen || isForResult) ? 'pointer' : null }} />
        </p>
        {
          !isChosen &&
          <p className='m-b-10'>{user.nickname}</p>
        }
        {
          (isHidden || (!isHidden && !isChosen)) && !isForResult &&
          <p className='m-b-30' style={{ minHeight: '22px' }}>{user.enabledHonors && user.enabledHonors.map((honor, idx) => <HonorBadge key={idx} honor={honor} />)}</p>
        }
        {
          ((!isHidden && isChosen) || isForResult) &&
          <p className={`m-b-${attrBonusInfo ? '10' : '30'}`} style={{ minHeight: '22px' }}>총 전투력: <span className='c-blue f-700'>{numeral(picks.reduce((accm, defender) => accm + defender.total + defender.addedTotal, 0) + 3 * getHonorBurfTotal(getHonorBurf(user))).format('0,0')}</span></p>
        }
        {
          isChosen && attrBonusInfo &&
          <div className='m-b-10'>
            내 상성: <span className={`c-${attrBonusInfo.userAttrBonus - 1 >= 0 ? 'green' : 'red'} f-700`}>{attrBonusInfo.userAttrBonus - 1 > 0 ? '+' : ''}{numeral(attrBonusInfo.userAttrBonus - 1).format('0%')}</span>
            <br />
            상대 상성: <span className={`c-${attrBonusInfo.enemyAttrBonus - 1 >= 0 ? 'green' : 'red'} f-700`}>{attrBonusInfo.enemyAttrBonus - 1 > 0 ? '+' : ''}{numeral(attrBonusInfo.enemyAttrBonus - 1).format('0%')}</span>
          </div>
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
            <p className='m-b-0'>순위: <span className='c-lightblue f-700'>{numeral(battleResultInfo.tobe.leagueRank).format('0,0')}</span>{battleResultInfo.tobe.leagueRank - battleResultInfo.asis.leagueRank !== 0 ? <span> (<span className={battleResultInfo.asis.leagueRank - battleResultInfo.tobe.leagueRank > 0 ? 'c-green' : 'c-red'}>{numeral(battleResultInfo.asis.leagueRank - battleResultInfo.tobe.leagueRank).format('+0,0')}</span>)</span> : <span>(-)</span>}</p>
            <p className='m-b-0'>점수: <span className='c-lightblue f-700'>{numeral(battleResultInfo.tobe.leaguePoint).format('0,0')}</span>{battleResultInfo.tobe.leaguePoint - battleResultInfo.asis.leaguePoint !== 0 ? <span> (<span className={battleResultInfo.tobe.leaguePoint - battleResultInfo.asis.leaguePoint > 0 ? 'c-green' : 'c-red'}>{numeral(battleResultInfo.tobe.leaguePoint - battleResultInfo.asis.leaguePoint).format('+0,0')}</span>)</span> : <span>(-)</span>}</p>
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
  isForResult: PropTypes.bool,
  attrBonusInfo: PropTypes.object,
  battleResultInfo: PropTypes.object
}

export default UserInfo
