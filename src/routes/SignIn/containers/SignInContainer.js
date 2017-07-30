import { connect } from 'react-redux'

import SignInView from '../components/SignInView'

import { setUser } from 'store/user'

const mapDispatchToProps = {
  setStoreUser: setUser
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInView)
