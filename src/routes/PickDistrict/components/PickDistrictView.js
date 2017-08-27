import React from 'react'
import PropTypes from 'prop-types'
import keygen from 'keygenerator'
import { fromJS, is } from 'immutable'

import Card from 'components/Card'
import Button from 'components/Button'
import AttrBadge from 'components/AttrBadge'
import WarningText from 'components/WarningText'

import { districts } from 'constants/data'

import { isScreenSize } from 'utils/commonUtil'

class PickDistrictView extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickPick = this._handleOnClickPick.bind(this)
  }
  componentDidMount () {
    const { user } = this.props
    if (!user) this.context.router.push('sign-in')
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props))
  }
  _handleOnClickPick (district, quantity) {
    const pickMonInfo = {
      quantity,
      attrs: district.attrs,
      grades: ['b']
    }
    this.props.receivePickMonInfo(pickMonInfo)
    this.context.router.push(`pick-mon?f=${keygen._()}`)
  }
  render () {
    const { user } = this.props
    const renderAttrBadges = attrs => {
      return attrs.map(attr =>
        <AttrBadge
          key={keygen._()}
          attr={attr}
        />
      )
    }
    const renderDistrictInfo = () => {
      return districts.map(district =>
        <div className={district.name === '중앙던전' ? 'col-xs-12' : 'col-sm-4'} key={keygen._()}>
          <Card
            header={<span style={{ fontSize: 'large' }}>{district.name}</span>}
            headerBgColor={district.color}
            headerTextColor={district.name === '중앙던전' ? '#333' : 'white'}
            body={
              <div>
                <p className='text-center' style={{ marginTop: '12px' }}>
                  {district.name === '중앙던전' ? '모든 속성의 포켓몬' : renderAttrBadges(district.attrs)}
                </p>
                {
                  user && user.pickCredit > 0 &&
                  <div className='text-center'>
                    <Button className='m-r-5' text='채집 X 1' onClick={() => this._handleOnClickPick(district, 1)} />
                    {
                      user.pickCredit > 1 &&
                      <Button text={`채집 X ${user.pickCredit > 6 ? 6 : user.pickCredit}`}
                        onClick={() => this._handleOnClickPick(district, user.pickCredit > 6 ? 6 : user.pickCredit)} />
                    }
                  </div>
                }
                {
                  user && user.pickCredit < 1 &&
                  <div className='text-center c-gray f-13'>
                    <WarningText text='채집크레딧이 부족합니다.' />
                  </div>
                }
              </div>
            }
          />
        </div>
      )
    }
    return (
      <div className='container container-alt' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='block-header'>
          <h1 style={{ fontSize: '23px' }}>채집 구역 선택</h1>
        </div>
        {renderDistrictInfo()}
      </div>
    )
  }
}

PickDistrictView.contextTypes = {
  router: PropTypes.object.isRequired
}

PickDistrictView.propTypes = {
  receivePickMonInfo: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default PickDistrictView
