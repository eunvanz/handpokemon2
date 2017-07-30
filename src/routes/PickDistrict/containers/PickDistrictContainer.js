import { connect } from 'react-redux'

import PickDistrictView from '../components/PickDistrictView'

import { setPickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = {
  setStorePickMonInfo: setPickMonInfo
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PickDistrictView)
