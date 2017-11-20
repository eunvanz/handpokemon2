import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { compose } from 'recompose'

import PickMonView from '../components/PickMonView'

import withUserCollections from 'hocs/withUserCollections'
import withAuth from 'hocs/withAuth'

import { updatePickMonInfo, clearPickMonInfo } from 'store/pickMonInfo'
import { showHonorModal, hideHonorModal } from 'store/honorModal'

import { convertMapToArr } from 'utils/commonUtil'

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
    pickMonInfo: state.pickMonInfo,
    honorModal: state.honorModal,
    honors: convertMapToArr(dataToJS(state.firebase, 'honors'))
  }
}

// const wrappedPickMonView = firebaseConnect(['/mons', '/honors'])(PickMonView)
const wrappedPickMonView = compose(withAuth(true), withUserCollections, firebaseConnect())(PickMonView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickMonView)
