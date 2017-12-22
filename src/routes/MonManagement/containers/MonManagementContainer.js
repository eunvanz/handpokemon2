import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import _ from 'lodash'
import { compose } from 'recompose'

import MonManagementView from '../components/MonManagementView'

import { convertMapToArr } from 'utils/commonUtil'

import withAuth from 'hocs/withAuth'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  mons: _.sortBy(convertMapToArr(dataToJS(state.firebase, 'mons')), ['no']),
  tempMons: _.sortBy(convertMapToArr(dataToJS(state.firebase, 'tempMons')), ['no'])
})

const wrappedMonManagementView = compose(firebaseConnect([
  '/mons', '/tempMons'
]), withAuth(true))(MonManagementView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedMonManagementView)
