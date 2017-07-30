import { connect } from 'react-redux'

import PickMonView from '../components/PickMonView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  user: state.user,
  pickMonInfo: state.pickMonInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(PickMonView)
