import { connect } from 'react-redux'

import SignInView from '../components/SignInView'

import { receiveUser } from 'store/user'

const mapDispatchToProps = {
  receiveUser: receiveUser
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInView)
