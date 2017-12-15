import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import ItemCard from 'components/ItemCard'
import CenterMidContaner from 'components/CenterMidContainer'
import Loading from 'components/Loading'

import { getMsg } from 'utils/commonUtil'

class GiftboxView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isUsingItem: false
    }
    this._handleOnClickUse = this._handleOnClickUse.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickUse () {
    this.setState({ isUsingItem: true })
    setTimeout(() => this.setState({ isUsingItem: false }), 500)
  }
  render () {
    const { user, messages, locale, auth } = this.props
    const { isUsingItem } = this.state
    const renderItems = () => {
      let newInventory = []
      if (user.inventory) {
        user.inventory.forEach(item => {
          const idx = _.findIndex(newInventory, e => e.id === item.id)
          if (idx >= 0) newInventory[idx].cnt = (newInventory[idx].cnt || 1) + 1
          else newInventory.push(Object.assign({}, item, { cnt: 1 }))
        })
      }
      if (newInventory.length === 0 && !isUsingItem) {
        return <CenterMidContaner bodyComponent={
          <div>{getMsg(messages.giftboxView.empty, locale)} <i className='far fa-frown' /></div>
        } />
      } else if (newInventory.length === 0 && isUsingItem) {
        return <CenterMidContaner bodyComponent={<Loading text={getMsg(messages.giftboxView.using, locale)} />} />
      }
      return newInventory.map((item, idx) => <ItemCard auth={auth} user={user}
        key={idx} item={item} onClickUse={this._handleOnClickUse} showCount />)
    }
    const renderBody = () => {
      return (
        <div className='row'>
          {renderItems()}
        </div>
      )
    }
    return (
      <ContentContainer
        title={getMsg(messages.sidebar.inventory, locale)}
        body={renderBody()}
      />
    )
  }
}

GiftboxView.contextTypes = {
  router: PropTypes.object.isRequired
}

GiftboxView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
}

export default GiftboxView
