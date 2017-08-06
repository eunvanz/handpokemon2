import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import SignUpView from '../components/SignUpView'

import { PROFILE_IMAGE_ROOT } from 'constants/urls'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
})

const wrappedSignUpView = firebaseConnect([
  PROFILE_IMAGE_ROOT
])(SignUpView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignUpView)
