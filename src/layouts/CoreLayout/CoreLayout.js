import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import MessageModal from 'components/MessageModal'

import { closeMessageModal } from 'store/messageModal'

const mapStateToProps = state => ({
  messageModal: state.messageModal
})

const mapDispatchToProps = {
  closeMessageModal
}

export const CoreLayout = ({ children, messageModal, closeMessageModal }) => (
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
      <MessageModal
        {...messageModal}
        close={closeMessageModal}
      />
    </section>
  </div>
)

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired,
  messageModal: PropTypes.object.isRequired,
  closeMessageModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
