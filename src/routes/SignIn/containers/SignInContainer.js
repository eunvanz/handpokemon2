import { connect } from 'react-redux'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'

import SignInView from '../components/SignInView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  const auth = pathToJS(state.firebase, 'auth')
  return ({
    user: auth ? dataToJS(state.firebase, `users/${pathToJS(state.firebase, 'auth').uid}`) : null,
    auth
  })
}

const wrappedSignInView = firebaseConnect([
  '/users'
])(SignInView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignInView)
