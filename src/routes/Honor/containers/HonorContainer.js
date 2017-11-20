import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import HonorView from '../components/HonorView'

import { convertMapToArr } from 'utils/commonUtil'

import withAuth from 'hocs/withAuth'

const mapDispatchToProps = dispatch => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
    honors: convertMapToArr(dataToJS(state.firebase, 'honors')),
    userCollections: dataToJS(state.firebase, 'userCollections')
  }
}

const wrappedHonorView = firebaseConnect([
  '/honors'
])(HonorView)

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(true)(wrappedHonorView))
