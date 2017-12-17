import { connect } from 'react-redux'
// import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { compose } from 'recompose'

import CollectionView from '../components/CollectionView'

// import { convertMapToArr } from 'utils/commonUtil'

import { updatePickMonInfo } from 'store/pickMonInfo'
import { showUserModal } from 'store/userModal'
import { setTutorialModal } from 'store/tutorialModal'

import withAuth from 'hocs/withAuth'
import withUserCollections from 'hocs/withUserCollections'

const mapDispatchToProps = dispatch => {
  return {
    updatePickMonInfo: pickMonInfo => dispatch(updatePickMonInfo(pickMonInfo)),
    showUserModal: userModal => dispatch(showUserModal(userModal)),
    setTutorialModal: tutorialModal => dispatch(setTutorialModal(tutorialModal))
  }
}
const mapStateToProps = (state) => {
  // const userCollections = dataToJS(state.firebase, 'userCollections')
  // let key = null
  // if (userCollections) key = Object.keys(userCollections)[0]
  return {
    // mons: convertMapToArr(dataToJS(state.firebase, 'mons')),
    // userCollections: key ? convertMapToArr(userCollections[key]) : null,
    pickMonInfo: state.pickMonInfo,
    userModal: state.userModal
  }
}
const wrappedCollectionView = compose(withAuth(false), withUserCollections)(CollectionView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCollectionView)
