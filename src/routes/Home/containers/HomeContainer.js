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
  firebaseConnect(['/works', '/chats', '/luckies']),
  withIntl,
  withBoards,
  withAuth(false),
  withMons
)(HomeView)

const mapStateToProps = (state) => {
  return {
    works: reverse(sortBy(convertMapToArr(dataToJS(state.firebase, 'works')), ['id'])),
    chats: {
      global: sortBy(convertMapToArr(dataToJS(state.firebase, 'chats/global')), item => item.id)
    },
    luckies: reverse(sortBy(convertMapToArr(dataToJS(state.firebase, 'luckies')), ['date']))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserModal: (userModal) => dispatch(setUserModal(userModal)),
    setTutorialModal: (tutorialModal) => dispatch(setTutorialModal(tutorialModal))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrappedHomeView)
