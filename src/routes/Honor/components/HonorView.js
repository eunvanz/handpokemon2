import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import numeral from 'numeral'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import HonorBadge from 'components/HonorBadge'
import Loading from 'components/Loading'

import { isScreenSize, countAttrsInCollections } from 'utils/commonUtil'

import { nullContainerHeight } from 'constants/styles'

import { setUserPath } from 'services/UserService'

class HonorView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      honorsType1: null,
      honorsType2: null,
      showBurfInfo: false
    }
    this._initStateHonors = this._initStateHonors.bind(this)
    this._handleOnClickActivate = this._handleOnClickActivate.bind(this)
  }
  componentDidMount () {
    this._initStateHonors()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.honors !== this.props.honors) this._initStateHonors()
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initStateHonors () {
    const { honors } = this.props
    const honorsType1 = _.orderBy(honors.filter(honor => honor.type === 1), ['condition'], ['asc'])
    const honorsType2 = _.orderBy(honors.filter(honor => honor.type === 2), ['attr', 'condition'], ['asc', 'asc'])
    this.setState({ honorsType1, honorsType2 })
  }
  _handleOnClickActivate (honor) {
    const replaceTypeHonor = (srcHonors, honorToInsert) => {
      const { type } = honorToInsert
      const tobeEnabledHonors = srcHonors.filter(honor => honor.type !== type)
      tobeEnabledHonors.push(honorToInsert)
      return tobeEnabledHonors
    }
    const { auth, user, firebase } = this.props
    const { enabledHonors } = user
    const tobeEnabledHonors = replaceTypeHonor(enabledHonors, honor)
    setUserPath(firebase, auth.uid, 'enabledHonors', tobeEnabledHonors)
    .then(() => {
      window.swal({
        confirmButtonText: '확인',
        title: '변경 완료',
        text: '새로운 칭호가 적용되었습니다.',
        type: 'success'
      })
    })
  }
  render () {
    const { honorsType1, honorsType2, showBurfInfo } = this.state
    const { user, honors, userCollections } = this.props
    let enabledHonors
    let gotHonors
    if (user) {
      enabledHonors = user.enabledHonors
      gotHonors = user.gotHonors
    }
    const isGotHonor = honor => {
      return _.findIndex(gotHonors, gotHonor => gotHonor.id === honor.id) > -1
    }
    const isEnabledHonor = honor => {
      return _.findIndex(enabledHonors, enabledHonor => enabledHonor.id === honor.id) > -1
    }
    const isDeservable = honor => {
      return honor.type === 1 ? user.colPoint >= honor.condition : countAttrsInCollections(honor.attr, userCollections) >= honor.condition
    }
    const renderBody = honors => {
      if (!honors || honors.length === 0) return <Loading text='업적정보를 불러오는 중...' height={nullContainerHeight} />
      const renderBufrInfo = burf => {
        if (!showBurfInfo) return <Button link size={isScreenSize.xs() ? 'xs' : 'md'} text={isScreenSize.xs() ? '효과' : '효과보이기'} icon='fa fa-caret-down' onClick={() => this.setState({ showBurfInfo: true })} />
        const statName = ['체력', '공격', '방어', '특공', '특방', '민첩']
        return (
          <div>
            {_.compact(burf.map((stat, idx) => {
              if (stat === 0) return null
              return (
                <div key={idx}>
                  {statName[idx]}: <span className='c-lightblue f-700'>+{stat}</span>
                </div>
              )
            }))}
          </div>
        )
      }
      const renderElements = () => {
        return honors.map((honor, idx) => {
          return (
            <tr key={idx}>
              <td className='text-center'><HonorBadge honor={honor} /></td>
              <td className='text-center hidden-xs'>{honor.type === 1 ? '콜렉션점수' : `${honor.attr} 속성`} <span className='c-lightblue f-700'>{numeral(honor.condition).format('0,0')}</span> {honor.type === 1 ? '점 이상 보유' : '개 이상 보유'}</td>
              <td className='text-center hidden-xs'>포키머니 <span className='c-lightblue f-700'>+{numeral(honor.reward).format('0,0')}</span></td>
              <td className='text-center'>{renderBufrInfo(honor.burf)}</td>
              <td className='text-center'>
                {
                  isEnabledHonor(honor)
                  ? <span className='c-green f-700'>활성화 됨</span> : isGotHonor(honor)
                  ? <Button color='green' size={isScreenSize.xs() ? 'xs' : 'md'}
                    text='활성화하기' onClick={() => this._handleOnClickActivate(honor)} disabled={!isDeservable(honor)} />
                  : <span className='c-deeporange'>미달성</span>
                }
              </td>
            </tr>
          )
        })
      }
      return (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th className='text-center'>칭호</th>
              <th className='text-center  hidden-xs'>업적</th>
              <th className='text-center hidden-xs'>보상</th>
              <th className='text-center' style={{ cursor: 'pointer' }} onClick={() => this.setState({ showBurfInfo: !showBurfInfo })}>효과 <i className={showBurfInfo ? 'fa fa-caret-up' : 'fa fa-caret-down'} /></th>
              <th className='text-center'>활성</th>
            </tr>
          </thead>
          <tbody>
            {renderElements()}
          </tbody>
        </table>
      )
    }
    if (user && honors && userCollections) {
      return (
        <div>
          <ContentContainer
            title='콜렉션 업적'
            body={renderBody(honorsType1)}
            clearPadding
          />
          <ContentContainer
            title='속성별 업적'
            body={renderBody(honorsType2)}
            clearPadding
          />
        </div>
      )
    } else {
      return (
        <Loading text='업적정보를 불러오는 중...' height={nullContainerHeight} />
      )
    }
  }
}

HonorView.contextTypes = {
  router: PropTypes.object.isRequired
}

HonorView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  honors: PropTypes.array.isRequired,
  userCollections: PropTypes.array
}

export default HonorView
