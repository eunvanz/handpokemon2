import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import SignInView from '../components/SignInView'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

import withIntl from 'hocs/withIntl'

const wrappedSignInView = compose(
  firebaseConnect(),
  withIntl
)(SignInView)

const mapStateToProps = state => {
  return { ...getAuthUserFromFirebase(state) }
}

export default connect(mapStateToProps, null)(wrappedSignInView)
