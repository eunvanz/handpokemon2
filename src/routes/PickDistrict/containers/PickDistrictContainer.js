import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickDistrictView from '../components/PickDistrictView'

import { updatePickMonInfo } from 'store/pickMonInfo'

import withAuth from 'hocs/withAuth'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo))
  }
}

const mapStateToProps = (state) => {
  return {
    pickMonInfo: state.pickMonInfo,
    creditInfo: state.creditInfo
  }
}

const wrappedPickDistrictView = firebaseConnect(['/mons'])(withAuth(true)(PickDistrictView))

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickDistrictView)
