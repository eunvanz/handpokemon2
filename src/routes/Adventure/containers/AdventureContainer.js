import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'
import withStages from 'hocs/withStages'
import withItems from 'hocs/withItems'

import AdventureView from '../components/AdventureView'

const wrappedAdventureView = compose(
  firebaseConnect(),
  withAuth(true),
  withIntl,
  withStages,
  withItems
)(AdventureView)

export default wrappedAdventureView
