import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import PickDistrictView from '../components/PickDistrictView'

import { updatePickMonInfo } from 'store/pickMonInfo'

import needAuth from 'hocs/needAuth'

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

const wrappedPickDistrictView = firebaseConnect(['/mons'])(needAuth(PickDistrictView))

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPickDistrictView)
