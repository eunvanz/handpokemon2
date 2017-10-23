import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import HonorView from '../components/HonorView'

import { getAuthUserFromFirebase, convertMapToArr } from 'utils/commonUtil'

const mapDispatchToProps = dispatch => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    honors: convertMapToArr(dataToJS(state.firebase, 'honors')),
    userCollections: dataToJS(state.firebase, 'userCollections')
  }
}

const wrappedHonorView = firebaseConnect([
  '/honors'
])(HonorView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedHonorView)
