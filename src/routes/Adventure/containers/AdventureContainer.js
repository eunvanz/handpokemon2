import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'
import withStages from 'hocs/withStages'
import withItems from 'hocs/withItems'

import AdventureView from '../components/AdventureView'

import { setTutorialModal } from 'store/tutorialModal'

const mapDispatchToProps = {
  setTutorialModal
}

const wrappedAdventureView = compose(
  connect(null, mapDispatchToProps),
  firebaseConnect(),
  withAuth(true),
  withIntl,
  withStages,
  withItems
)(AdventureView)

export default wrappedAdventureView
