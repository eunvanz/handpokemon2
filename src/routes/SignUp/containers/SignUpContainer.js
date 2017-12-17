import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import SignUpView from '../components/SignUpView'

import { receiveUser } from 'store/user'
import { setTutorialModal } from 'store/tutorialModal'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

import withIntl from 'hocs/withIntl'

const mapDispatchToProps = {
  receiveUser,
  setTutorialModal
}

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state)
  }
}

const wrappedSignUpView = compose(firebaseConnect(), withIntl)(SignUpView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSignUpView)
