import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import validator from 'validator'

import { isScreenSize } from 'utils/commonUtil'

import { ATTR_MATCH, ATTR_IDX } from 'constants/rules'
import { colors } from 'constants/colors'

import Loading from 'components/Loading'
import MonCard from 'components/MonCard'
import CenterMidContainer from 'components/CenterMidContainer'
import Card from 'components/Card'
import UserInfo from './UserInfo'

class ChooseEnemy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isHidden: true,
      chosenIdx: null,
      showUserModal: false
    }
    this._getAttrBonus = this._getAttrBonus.bind(this)
    this._getAttrMatchAdjustedVar = this._getAttrMatchAdjustedVar.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _getAttrBonus (enemyPicks) {
    const { userPicks } = this.props
    const userTotal = userPicks.reduce((accm, pick) => accm + pick.total + pick.addedTotal, 0)
    const userRatios = userPicks.map(pick => (pick.total + pick.addedTotal) / userTotal)
    const enemyTotal = enemyPicks.reduce((accm, pick) => accm + pick.total + pick.addedTotal, 0)
    const enemyRatios = enemyPicks.map(pick => (pick.total + pick.addedTotal) / enemyTotal)
    let userAttrBonus = 0
    let enemyAttrBonus = 0
    userPicks.forEach((up, uidx) => {
      enemyPicks.forEach((ep, eidx) => {
        userAttrBonus += this._getAttrMatchAdjustedVar(up, ep) * (userRatios[uidx] + enemyRatios[eidx])
        enemyAttrBonus += this._getAttrMatchAdjustedVar(ep, up) * (userRatios[uidx] + enemyRatios[eidx])
      })
    })
    return { userAttrBonus: userAttrBonus / 6, enemyAttrBonus: enemyAttrBonus / 6 }
  }
  _getAttrMatchAdjustedVar (attackerPick, defenderPick) {
    const srcCollection = attackerPick
    const tgtCollection = defenderPick
    const srcMainAttr = srcCollection.mon[srcCollection.monId].mainAttr
    const srcSubAttr = srcCollection.mon[srcCollection.monId].subAttr
    const tgtMainAttr = tgtCollection.mon[tgtCollection.monId].mainAttr
    const tgtSubAttr = tgtCollection.mon[tgtCollection.monId].subAttr
    const srcMainAttrIdx = ATTR_IDX.indexOf(srcMainAttr)
    const srcSubAttrIdx = ATTR_IDX.indexOf(srcSubAttr)
    const tgtMainAttrIdx = ATTR_IDX.indexOf(tgtMainAttr)
    const tgtSubAttrIdx = ATTR_IDX.indexOf(tgtSubAttr)
    let result = 1
    result = ATTR_MATCH[srcMainAttrIdx][tgtMainAttrIdx]
    if (tgtSubAttrIdx !== -1) result = result * ATTR_MATCH[srcMainAttrIdx][tgtSubAttrIdx]
    if (srcSubAttrIdx !== -1) {
      result = result * ATTR_MATCH[srcSubAttrIdx][tgtMainAttrIdx]
      if (tgtSubAttrIdx !== -1) result = result * ATTR_MATCH[srcSubAttrIdx][tgtSubAttrIdx]
    }
    return result
  }
  render () {
    const { candidates, onClickChoose, userPicks } = this.props
    const { isHidden, chosenIdx, showUserModal } = this.state
    const renderMonCards = (defenders, user) => {
      const showIdx = _.random(0, defenders.length - 1)
      return defenders.map((defender, idx) => {
        if (idx === showIdx) {
          return (
            <MonCard
              key={defender.id}
              mon={{ tobe: defender }}
              isNotMine
              type='collection'
              user={user}
            />
          )
        } else {
          return (
            <MonCard key={idx} isDummy isNotMine type='collection' />
          )
        }
      })
    }
    const renderAllMonCards = (defenders, user) => {
      return defenders.map((defender, idx) => {
        return (
          <MonCard
            key={defender.id}
            mon={{ tobe: defender }}
            isNotMine
            type='collection'
            user={user}
          />
        )
      })
    }
    const renderAllHiddenCard = (defenders) => {
      return defenders.map((defender, idx) => {
        return (
          <MonCard key={defender.id} isDummy isNotMine type='collection' />
        )
      })
    }
    const renderCandidates = () => {
      return candidates.map((candidate, idx) => {
        const { user, defenders } = candidate
        return (
          <Card
            key={user.nickname}
            body={
              <div className='row'>
                <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
                  <UserInfo
                    isHidden={isHidden}
                    isChosen={chosenIdx === idx}
                    user={user}
                    onClickChoose={() => this.setState({ isHidden: false, chosenIdx: idx })}
                    onClickNext={() => onClickChoose(idx)}
                    picks={defenders}
                    attrBonusInfo={this._getAttrBonus(defenders)}
                  />
                </div>
                {isHidden && renderMonCards(defenders, user)}
                {(!isHidden && chosenIdx !== idx) && renderAllHiddenCard(defenders)}
                {(!isHidden && chosenIdx === idx) && renderAllMonCards(defenders, user)}
                <div className='col-xs-12 col-md-offset-2 col-md-8 m-t-10 alert' style={{ backgroundColor: colors.lightGray, fontSize: '14px' }}>
                  {validator.isEmpty(user.introduce) ? '자기소개가 없습니다.' : user.introduce}
                </div>
              </div>
            }
          />
        )
      })
    }
    const renderBody = () => {
      if (userPicks && candidates) {
        return (
          <div className='text-center'>
            {renderCandidates()}
          </div>
        )
      } else {
        return <CenterMidContainer bodyComponent={<Loading text='대전 상대 탐색 중...' />} />
      }
    }
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='block-header'>
          <h1 style={{ fontSize: '20px' }}>대전 상대 선택</h1>
        </div>
        {renderBody()}
      </div>
    )
  }
}

ChooseEnemy.contextTypes = {
  router: PropTypes.object.isRequired
}

ChooseEnemy.propTypes = {
  candidates: PropTypes.array,
  onClickChoose: PropTypes.func.isRequired,
  userPicks: PropTypes.array
}

export default ChooseEnemy
