import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'
import withBoards from 'hocs/withBoards'

import BoardListView from '../components/BoardListView'

const mapDispatchToProps = dispatch => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const wrappedBoardListView = compose(
  firebaseConnect(),
  withAuth(false),
  withIntl,
  withBoards
)(BoardListView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedBoardListView)
