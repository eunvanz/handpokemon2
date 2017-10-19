import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import PickMonView from '../components/PickMonView'

import { updatePickMonInfo, clearPickMonInfo } from 'store/pickMonInfo'
import { showHonorModal, hideHonorModal } from 'store/honorModal'

import { getAuthUserFromFirebase, convertMapToArr } from 'utils/commonUtil'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo)),
    clearPickMonInfo: () => dispatch(clearPickMonInfo()),
    showHonorModal: honorInfo => dispatch(showHonorModal(honorInfo)),
    hideHonorModal: () => dispatch(hideHonorModal())
  }
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    pickMonInfo: state.pickMonInfo,
    honorModal: state.honorModal,
    honors: convertMapToArr(dataToJS(state.firebase, 'honors')),
    userCollections: dataToJS(state.firebase, 'userCollections')
  }
}

const wrappedPickMonView = firebaseConnect(['/mons', '/honors'])(PickMonView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickMonView)
