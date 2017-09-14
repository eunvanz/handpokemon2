import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import SignUpView from '../components/SignUpView'

import { receiveUser } from 'store/user'

const mapDispatchToProps = {
  receiveUser
}

const mapStateToProps = (state) => ({
  user: state.user
})

const wrappedSignUpView = firebaseConnect()(SignUpView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignUpView)
