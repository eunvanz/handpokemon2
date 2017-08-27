import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import CollectionView from '../components/CollectionView'

import { getAuthUserFromFirebase, convertMapToArr } from 'utils/commonUtil'

import { receivePickMonInfo } from 'store/pickMonInfo'
import { showUserModal } from 'store/userModal'

const mapDispatchToProps = {
  receivePickMonInfo,
  showUserModal
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    mons: convertMapToArr(dataToJS(state.firebase, 'mons')),
    pickMonInfo: state.pickMonInfo,
    userModal: state.userModal
  }
}

const wrappedCollectionView = firebaseConnect([
  'collections'
])(CollectionView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCollectionView)
