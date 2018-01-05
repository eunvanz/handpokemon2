import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { compose } from 'recompose'

import HonorView from '../components/HonorView'

import { convertMapToArr } from 'utils/commonUtil'

import withAuth from 'hocs/withAuth'
import withUserCollections from 'hocs/withUserCollections'

const mapDispatchToProps = dispatch => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
    honors: convertMapToArr(dataToJS(state.firebase, 'honors'))
  }
}

const wrappedHonorView = compose(firebaseConnect([
  '/honors'
]), withAuth(true), withUserCollections)(HonorView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedHonorView)
