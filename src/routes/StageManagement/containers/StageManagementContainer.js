import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withMons from 'hocs/withMons'
import withStages from 'hocs/withStages'

import StageManagementView from '../components/StageManagementView'

const wrappedStageManagementView = compose(
  firebaseConnect(),
  withAuth(true),
  withMons,
  withStages
)(StageManagementView)

export default (wrappedStageManagementView)
