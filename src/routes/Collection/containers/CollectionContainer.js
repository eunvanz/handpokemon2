import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'

import CollectionView from '../components/CollectionView'

import { getAuthUserFromFirebase, convertMapToArr } from 'utils/commonUtil'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    mons: convertMapToArr(dataToJS(state.firebase, 'mons'))
  }
}

const wrappedCollectionView = firebaseConnect([
])(CollectionView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCollectionView)
