import { connect } from 'react-redux'

import PickDistrictView from '../components/PickDistrictView'

import { receivePickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = {
  receivePickMonInfo: receivePickMonInfo
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PickDistrictView)
