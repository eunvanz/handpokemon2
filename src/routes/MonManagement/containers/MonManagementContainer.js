import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import _ from 'lodash'

import MonManagementView from '../components/MonManagementView'

import { convertMapToArr } from 'utils/commonUtil'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  mons: _.sortBy(convertMapToArr(dataToJS(state.firebase, 'mons')), ['no'])
})

const wrappedMonManagementView = firebaseConnect([
  'mons'
])(MonManagementView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedMonManagementView)
