import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import SignInView from '../components/SignInView'

import { receiveUser } from 'store/user'

const mapDispatchToProps = {
  receiveUser: receiveUser
}

const mapStateToProps = (state) => ({
  users: dataToJS(state.firebase, 'users')
})

const wrappedSignInView = firebaseConnect([
  '/users'
])(SignInView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignInView)
