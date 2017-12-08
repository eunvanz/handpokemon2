import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'
import withItems from 'hocs/withItems'

import ItemShopView from '../components/ItemShopView'

const wrappedItemShopView = compose(
  firebaseConnect(),
  withAuth(true),
  withIntl,
  withItems
)(ItemShopView)

export default wrappedItemShopView
