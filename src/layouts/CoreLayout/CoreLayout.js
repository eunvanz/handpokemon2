import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import MessageModal from 'components/MessageModal'
import UserModal from 'components/UserModal'
import Footer from 'components/Footer'

import { closeMessageModal } from 'store/messageModal'
import { closeUserModal } from 'store/userModal'

const mapStateToProps = state => ({
  messageModal: state.messageModal,
  userModal: state.userModal
})

const mapDispatchToProps = {
  closeMessageModal,
  closeUserModal
}

class CoreLayout extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  render () {
    const { children, messageModal, closeMessageModal, userModal, closeUserModal } = this.props
    return (
      <div>
        <Helmet
          title='손켓몬 시즌2'
          link={[
            {
              'rel': 'stylesheet',
              'type': 'text/css',
              'href': '//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/vendors/bower_components/animate.css/animate.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/vendors/bower_components/sweetalert2/dist/sweetalert2.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/css/inc/app_1.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/css/inc/app_2.css'
            }
          ]}
        />
        <Header />
        <section id='main'>
          <Sidebar />
          <section id='content' className='core-layout__viewport'>
            {children}
          </section>
          <Footer />
          <MessageModal
            {...messageModal}
            close={closeMessageModal}
          />
          <UserModal
            {...userModal}
            close={closeUserModal}
          />
        </section>
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired,
  messageModal: PropTypes.object.isRequired,
  closeMessageModal: PropTypes.func.isRequired,
  userModal: PropTypes.object.isRequired,
  closeUserModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
