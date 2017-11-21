import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

import { isScreenSize } from 'utils/commonUtil'

import ContentContainer from 'components/ContentContainer'
import Loading from 'components/Loading'
import Img from 'components/Img'
import MonCard from 'components/MonCard'
import CenterMidContainer from 'components/CenterMidContainer'
import Button from 'components/Button'
import Card from 'components/Card'

class Step2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { candidates } = this.props
    const renderMonCards = (defenders) => {
      return defenders.map((defender, idx) => {
        if (idx === 0) {
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
            body={
              <div className='row' key={idx}>
                <div className='col-md-2 col-sm-3 col-xs-6 col-md-offset-2'>
                  <p style={{ marginBottom: '10px' }}>
                    <Img src={user.profileImage} width='100%'
                      style={{ border: '1px dotted #e2e2e2', maxWidth: '200px' }} />
                  </p>
                  <p className='m-b-15'>{user.nickname}</p>
                  <Button text='선택' size='xs' block color='orange' />
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

Step2.contextTypes = {
  router: PropTypes.object.isRequired
}

Step2.propTypes = {
  candidates: PropTypes.array
}

export default Step2
