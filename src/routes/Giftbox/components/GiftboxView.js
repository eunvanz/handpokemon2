import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

import ContentContainer from 'components/ContentContainer'
import ItemCard from 'components/ItemCard'
import CenterMidContaner from 'components/CenterMidContainer'

import { getMsg } from 'utils/commonUtil'

class GiftboxView extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { user, messages, locale, auth } = this.props
    const renderItems = () => {
      let newInventory = []
      if (user.inventory) {
        user.inventory.forEach(item => {
          const idx = _.findIndex(newInventory, e => e.id === item.id)
          if (idx >= 0) newInventory[idx].cnt = (newInventory[idx].cnt || 1) + 1
          else newInventory.push(Object.assign({}, item, { cnt: 1 }))
        })
      }
      if (newInventory.length === 0) return <CenterMidContaner bodyComponent={<div>{getMsg(messages.giftboxView.empty, locale)}</div>} />
      return newInventory.map((item, idx) => <ItemCard auth={auth} user={user} key={idx} item={item} showCount />)
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
