import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickMonView from '../components/PickMonView'

import { receivePickMonInfo, clearPickMonInfo } from 'store/pickMonInfo'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = {
  receivePickMonInfo,
  clearPickMonInfo
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    pickMonInfo: state.pickMonInfo
  }
}

const wrappedPickMonView = firebaseConnect([
])(PickMonView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickMonView)
