import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickDistrictView from '../components/PickDistrictView'

import { updatePickMonInfo } from 'store/pickMonInfo'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo))
  }
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    pickMonInfo: state.pickMonInfo,
    creditInfo: state.creditInfo
  }
}

const wrappedPickDistrictView = firebaseConnect([
])(PickDistrictView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickDistrictView)
