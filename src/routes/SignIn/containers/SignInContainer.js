import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import SignInView from '../components/SignInView'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  return ({
    ...getAuthUserFromFirebase(state)
  })
}

const wrappedSignInView = firebaseConnect()(SignInView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignInView)
