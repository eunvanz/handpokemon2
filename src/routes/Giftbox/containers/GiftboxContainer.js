import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'

import GiftboxView from '../components/GiftboxView'

const wrappedGiftboxView = compose(
  firebaseConnect(),
  withAuth(true)
)(GiftboxView)

export default wrappedGiftboxView
