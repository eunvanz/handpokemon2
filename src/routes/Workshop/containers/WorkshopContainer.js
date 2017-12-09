import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { compose } from 'recompose'
import { reverse } from 'lodash'

import { convertMapToArr } from 'utils/commonUtil'

import withAuth from 'hocs/withAuth'

import WorkshopView from '../components/WorkshopView'

const mapStateToProps = (state) => {
  return {
    works: reverse(convertMapToArr(dataToJS(state.firebase, 'works')))
  }
}

const wrappedWorkshopView = compose(
  firebaseConnect(['/works']),
  withAuth(false)
)(WorkshopView)

export default connect(mapStateToProps, null)(wrappedWorkshopView)
