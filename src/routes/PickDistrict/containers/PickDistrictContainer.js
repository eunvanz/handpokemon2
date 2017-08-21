import { connect } from 'react-redux'

import PickDistrictView from '../components/PickDistrictView'

import { receivePickMonInfo } from 'store/pickMonInfo'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = {
  receivePickMonInfo: receivePickMonInfo
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    pickMonInfo: state.pickMonInfo
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickDistrictView)
