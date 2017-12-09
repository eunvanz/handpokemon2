import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import withIntl from 'hocs/withIntl'

import HomeView from '../components/HomeView'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const wrappedHomeView = compose(
  firebaseConnect(),
  withIntl
)(HomeView)

const mapStateToProps = state => {
  return { ...getAuthUserFromFirebase(state) }
}

export default connect(mapStateToProps, null)(wrappedHomeView)
