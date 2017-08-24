import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import CollectionView from '../components/CollectionView'

import { getAuthUserFromFirebase, convertMapToArr } from 'utils/commonUtil'

import { receivePickMonInfo } from 'store/pickMonInfo'

const mapDispatchToProps = {
  receivePickMonInfo
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    mons: convertMapToArr(dataToJS(state.firebase, 'mons')),
    pickMonInfo: state.pickMonInfo
  }
}

const wrappedCollectionView = firebaseConnect([
])(CollectionView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCollectionView)
