import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'

import SettingView from '../components/SettingView'

const wrappedSettingView = compose(
  firebaseConnect(),
  withAuth(true),
  withIntl
)(SettingView)

export default wrappedSettingView
