import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { compose } from 'recompose'
import keygen from 'keygenerator'
import { firebaseConnect } from 'react-redux-firebase'
import { toast } from 'react-toastify'

import Img from 'components/Img'
import CustomModal from 'components/CustomModal'
import Button from 'components/Button'

import withIntl from 'hocs/withIntl'
import withPickMonInfo from 'hocs/withPickMonInfo'

import { getMsg } from 'utils/commonUtil'

import { MAX_PICK_CREDIT, MAX_BATTLE_CREDIT } from 'constants/rules'

import { updateUserPokemoney, updateUserInventory, setUserPath } from 'services/UserService'

class ItemCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showUseItemModal: false,
      isLoading: false
    }
    this._handleOnClickBuy = this._handleOnClickBuy.bind(this)
    this._handleOnClickUse = this._handleOnClickUse.bind(this)
  }
  _handleOnClickBuy () {
    this.setState({ isLoading: true })
    const { item, firebase, auth, user, messages, locale } = this.props
    if (item.cost > user.pokemoney) return window.swal({ text: getMsg(messages.itemCard.moneyShortageMessage, locale) })
    updateUserPokemoney(firebase, auth.uid, item.cost * -1)
    .then(() => {
      return updateUserInventory(firebase, auth.uid, item, 'save', 1)
      .catch((msg) => {
        window.swal({ text: getMsg(messages.itemCard.errorDuringSending) })
        return updateUserPokemoney(firebase, auth.uid, item.cost)
      }) // 아이템을 넣다가 오류났을 경우 보상로직
    })
    .then(() => {
      // window.swal({ text: getMsg(messages.itemCard.successToBuy, locale) })
      toast(getMsg(messages.itemCard.successToBuy, locale))
      this.setState({ isLoading: false, showUseItemModal: false })
    })
    .catch(msg => {
      window.swal({ text: `${getMsg(messages.itemCard.errorDuringBuy, locale)} - ${msg}` })
    })
  }
  _handleOnClickUse (quantity) {
    this.setState({ isLoading: true })
    const { item, updatePickMonInfo, firebase, auth, messages, locale, onClickUse } = this.props
    if (quantity > item.cnt) return window.swal({ text: `${getMsg(messages.itemCard.errorDuringUse)}` })
    onClickUse()
    if (item.type === 1) {
      const pickMonInfo = {
        isReward: true,
        quantity,
        attrs: ['노말', '땅', '유령', '불꽃', '비행', '강철', '염력', '독', '용', '전기', '벌레', '악', '풀', '격투', '바위', '물', '얼음', '요정'],
        grades: item.grades || item.attrs // attr로 잘못 입력한 데이터에 대한 처리 (추후 삭제 필요)
      }
      updateUserInventory(firebase, auth.uid, item, 'use', quantity)
      .catch(msg => {
        window.swal({ text: `${getMsg(messages.itemCard.errorDuringUse, locale)} - ${msg}` })
      })
      .then(() => {
        return updatePickMonInfo(pickMonInfo)
      })
      .then(() => {
        this.context.router.push(`pick-mon?f=${keygen._()}`)
      })
    } else if (item.type === 2) {
      let max
      if (item.creditType === 'pick') max = MAX_PICK_CREDIT
      else if (item.creditType === 'battle') max = MAX_BATTLE_CREDIT
      updateUserInventory(firebase, auth.uid, item, 'use', quantity)
      .catch(msg => {
        window.swal({ text: `${getMsg(messages.itemCard.errorDuringUse, locale)} - ${msg}` })
      })
      .then(() => {
        return setUserPath(firebase, auth.uid, `${item.creditType}Credit`, max)
        .catch(msg => {
          updateUserInventory(firebase, auth.uid, item, 'save', quantity) // 보상로직
          window.swal({ text: `${getMsg(messages.itemCard.errorDuringUse, locale)} - ${msg}` })
        })
      })
      .then(() => {
        this.setState({ isLoading: false, showUseItemModal: false })
        toast.info(getMsg(messages.itemCard.successToUse, locale))
        // window.swal({ text: getMsg(messages.itemCard.successToUse, locale) })
      })
    }
  }
  render () {
    const { item, messages, locale, showCount, showCost, user, auth } = this.props
    const { showUseItemModal, isLoading } = this.state
    const renderFooterComponent = () => {
      if (showCount) {
        if (item.type === 1) {
          return (
            <div>
              <Button disabled={isLoading} link text={getMsg(messages.common.cancel, locale)} onClick={() => this.setState({ showUseItemModal: false })} />
              <Button disabled={isLoading} className='m-l-5' text={`${getMsg(messages.itemCard.use, locale)} X 1`} onClick={() => this._handleOnClickUse(1)} />
              {
                item.cnt > 1 &&
                <Button disabled={isLoading} className='m-l-5' text={`${getMsg(messages.itemCard.use, locale)} X ${item.cnt >= 6 ? '6' : item.cnt}`} onClick={() => this._handleOnClickUse(item.cnt >= 6 ? 6 : item.cnt)} />
              }
            </div>
          )
        } else if (item.type === 2) {
          return (
            <div>
              <Button disabled={isLoading} link text={getMsg(messages.common.cancel, locale)} onClick={() => this.setState({ showUseItemModal: false })} />
              <Button disabled={isLoading} className='m-l-5' text={`${getMsg(messages.itemCard.use, locale)} X 1`} onClick={() => this._handleOnClickUse(1)} />
            </div>
          )
        }
      } else if (showCost) {
        return (
          <div>
            <Button disabled={isLoading} link text={getMsg(messages.common.cancel, locale)} onClick={() => this.setState({ showUseItemModal: false })} />
            <Button disabled={!auth || user.pokemoney < item.cost} loading={isLoading} className='m-l-5' text={getMsg(messages.itemCard.buy, locale)} onClick={this._handleOnClickBuy} />
          </div>
        )
      }
    }
    return (
      <div className='col-md-2 col-sm-3 col-xs-6' style={{ padding: '0px 5px' }}>
        <div className='c-item'
          onClick={() => this.setState({ showUseItemModal: true })}
          style={{
            cursor: 'pointer',
            border: '1px solid #e2e2e2',
            marginBottom: '8px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px',
            backgroundColor: 'white'
          }}>
          <a className='ci-avatar'>
            <Img src={item.img} width='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
            <span className='c-lightblue f-700' style={{ fontSize: '14px' }}>{getMsg(item.name, locale)}</span>
          </div>
          {
            showCount &&
            <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
              {getMsg(messages.itemCard.quantity, locale)}: <span className='c-lightblue f-700'>{item.cnt}</span>
            </div>
          }
          {
            showCost &&
            <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
              <span className='c-deeporange f-700'>{numeral(item.cost).format('0,0')}P</span>
            </div>
          }
        </div>
        <CustomModal
          title={showCount ? getMsg(messages.itemCard.useItem, locale) : getMsg(messages.itemCard.purchaseItem, locale)}
          bodyComponent={
            <div>
              <span className='c-lightblue'>{getMsg(item.description, locale)}</span>
            </div>
          }
          footerComponent={
            renderFooterComponent()
          }
          show={showUseItemModal}
          close={() => this.setState({ showUseItemModal: false })}
          backdrop
        />
      </div>
    )
  }
}

ItemCard.contextTypes = {
  router: PropTypes.object.isRequired
}

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  showCount: PropTypes.bool,
  showCost: PropTypes.bool,
  auth: PropTypes.object,
  user: PropTypes.object,
  firebase: PropTypes.object.isRequired,
  updatePickMonInfo: PropTypes.func.isRequired,
  onClickUse: PropTypes.func
}

export default compose(firebaseConnect(), withIntl, withPickMonInfo)(ItemCard)
