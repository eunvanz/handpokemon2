import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import MonManagementView from '../components/MonManagementView'

import { convertMapToArr } from 'utils/commonUtil'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  mons: convertMapToArr(dataToJS(state.firebase, 'mons'))
})

const wrappedMonManagementView = firebaseConnect([
  'mons'
])(MonManagementView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedMonManagementView)
