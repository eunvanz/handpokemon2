import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import SignUpView from '../components/SignUpView'

import { PROFILE_IMAGE_ROOT } from 'constants/urls'

import { receiveUser } from 'store/user'

const mapDispatchToProps = {
  receiveUser
}

const mapStateToProps = (state) => ({
  user: state.user
})

const wrappedSignUpView = firebaseConnect([
  PROFILE_IMAGE_ROOT
])(SignUpView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignUpView)
