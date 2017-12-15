import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'

import IntroduceView from '../components/IntroduceView'

const mapDispatchToProps = dispatch => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const wrappedIntroduceView = compose(
  firebaseConnect(),
  withAuth(true),
  withIntl
)(IntroduceView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedIntroduceView)
