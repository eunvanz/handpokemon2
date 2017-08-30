import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickDistrictView from '../components/PickDistrictView'

import { receivePickMonInfo } from 'store/pickMonInfo'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = {
  receivePickMonInfo: receivePickMonInfo
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
