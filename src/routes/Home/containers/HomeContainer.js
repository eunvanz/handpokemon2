import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { reverse, sortBy } from 'lodash'

import withIntl from 'hocs/withIntl'
import withBoards from 'hocs/withBoards'
import withAuth from 'hocs/withAuth'
import withMons from 'hocs/withMons'

import { convertMapToArr } from 'utils/commonUtil'

import HomeView from '../components/HomeView'

import { setUserModal } from 'store/userModal'
import { setTutorialModal } from 'store/tutorialModal'

const wrappedHomeView = compose(
  firebaseConnect(['/works', '/chats']),
  withIntl,
  withBoards,
  withAuth(false),
  withMons
)(HomeView)

const mapStateToProps = (state) => {
  return {
    works: reverse(convertMapToArr(dataToJS(state.firebase, 'works'))),
    chats: {
      global: sortBy(convertMapToArr(dataToJS(state.firebase, 'chats/global')), item => item.id)
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserModal: (userModal) => dispatch(setUserModal(userModal)),
    setTutorialModal: (tutorialModal) => dispatch(setTutorialModal(tutorialModal))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrappedHomeView)
