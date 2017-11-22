import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { isScreenSize } from 'utils/commonUtil'

import Loading from 'components/Loading'
import Img from 'components/Img'
import MonCard from 'components/MonCard'
import CenterMidContainer from 'components/CenterMidContainer'
import Button from 'components/Button'
import Card from 'components/Card'
import HonorBadge from 'components/HonorBadge'

class ChooseEnemy extends React.PureComponent {
  render () {
    const { candidates, onClickChoose } = this.props
    const renderMonCards = (defenders) => {
      const showIdx = _.random(0, defenders.length - 1)
      return defenders.map((defender, idx) => {
        if (idx === showIdx) {
          return (
            <MonCard
              key={idx}
              mon={{ tobe: defender }}
              isNotMine
              type='collection'
            />
          )
        } else {
          return (
            <MonCard key={idx} isDummy isNotMine type='collection' />
          )
        }
      })
    }
    const renderCandidates = () => {
      return candidates.map((candidate, idx) => {
        const { user, defenders } = candidate
        return (
          <Card
            key={idx}
            body={
              <div className='row' key={idx}>
                <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
                  <p style={{ marginBottom: '10px' }}>
                    <Img src={user.profileImage} className='mCS_img_loaded'
                      style={{ border: '1px dotted #e2e2e2', width: isScreenSize.xs() ? '50%' : '70%', borderRadius: '50%' }} />
                  </p>
                  <p className='m-b-10'>{user.nickname}</p>
                  <p className='m-b-30' style={{ minHeight: '22px' }}>{user.enabledHonors && user.enabledHonors.map((honor, idx) => <HonorBadge key={idx} honor={honor} />)}</p>
                  <Button text='선택' size='xs' block color='orange' onClick={() => onClickChoose(idx)} />
                </div>
                {renderMonCards(_.shuffle(defenders))}
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
