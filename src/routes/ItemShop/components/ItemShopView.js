import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import ItemCard from 'components/ItemCard'

import { getMsg } from 'utils/commonUtil'

class ItemShopView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { messages, locale, items, auth, firebase, user } = this.props
    const renderBody = () => {
      return (
        <div className='row'>
          {
            items.map((item, idx) => <ItemCard key={idx} item={item} auth={auth} user={user} firebase={firebase} showCost />)
          }
        </div>
      )
    }
    return (
      <ContentContainer
        title={getMsg(messages.sidebar.itemShop, locale)}
        body={renderBody()}
      />
    )
  }
}

ItemShopView.contextTypes = {
  router: PropTypes.object.isRequired
}

ItemShopView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired
}

export default ItemShopView
