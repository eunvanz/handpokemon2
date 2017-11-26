import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import numeral from 'numeral'

import { isScreenSize } from 'utils/commonUtil'

import Loading from 'components/Loading'
import Img from 'components/Img'
import MonCard from 'components/MonCard'
import CenterMidContainer from 'components/CenterMidContainer'
import Button from 'components/Button'
import Card from 'components/Card'
import HonorBadge from 'components/HonorBadge'
import UserModal from 'components/UserModal'
import UserInfo from './UserInfo'

class ChooseEnemy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isHidden: true,
      chosenIdx: null,
      showUserModal: false
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { candidates, onClickChoose } = this.props
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
          <MonCard key={idx} isDummy isNotMine type='collection' />
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
                  />
                </div>
                {isHidden && renderMonCards(defenders, user)}
                {(!isHidden && chosenIdx !== idx) && renderAllHiddenCard(defenders)}
                {(!isHidden && chosenIdx === idx) && renderAllMonCards(defenders, user)}
              </div>
            }
          />
        )
      })
    }
    const renderBody = () => {
      if (candidates) {
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
          <h1 style={{ fontSize: '23px' }}>대전 상대 선택</h1>
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
  onClickChoose: PropTypes.func.isRequired
}

export default ChooseEnemy
