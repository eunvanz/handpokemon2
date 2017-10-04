import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickMonView from '../components/PickMonView'

import { updatePickMonInfo, clearPickMonInfo } from 'store/pickMonInfo'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo)),
    clearPickMonInfo: () => dispatch(clearPickMonInfo())
  }
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    pickMonInfo: state.pickMonInfo
  }
}

const wrappedPickMonView = firebaseConnect(['/mons'])(PickMonView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickMonView)
