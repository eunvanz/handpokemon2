import { connect } from 'react-redux'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'

import PickMonView from '../components/PickMonView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  const auth = pathToJS(state.firebase, 'auth')
  return {
    user: auth ? dataToJS(state.firebase, `users/${pathToJS(state.firebase, 'auth').uid}`) : null,
    auth,
    pickMonInfo: state.pickMonInfo
  }
}

const wrappedPickMonView = firebaseConnect([
])(PickMonView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickMonView)
