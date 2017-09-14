import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import RankingView from '../components/RankingView'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state)
  }
}

const wrappedRankingView = firebaseConnect()(RankingView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedRankingView)
