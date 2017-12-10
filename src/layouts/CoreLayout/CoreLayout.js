import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { fromJS, is } from 'immutable'
import { compose } from 'recompose'
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Footer from 'components/Footer'
import UserModal from 'components/UserModal'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'

import { closeUserModal } from 'store/userModal'

const mapStateToProps = state => ({
  userModal: state.userModal
})

const mapDispatchToProps = {
  closeUserModal
}

class CoreLayout extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  render () {
    const { children, messages, locale, userModal, closeUserModal } = this.props
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
              'href': '/vendors/bower_components/nouislider/distribute/nouislider.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': '/vendors/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css'
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
          <Sidebar messages={messages} locale={locale} />
          <section id='content' className='core-layout__viewport'>
            {React.Children.map(children, child => React.cloneElement(child, { messages, locale }))}
          </section>
          <Footer messages={messages} locale={locale} />
        </section>
        <UserModal
          {...userModal}
          close={closeUserModal}
        />
        <ToastContainer
          className='toast'
          position={toast.POSITION.BOTTOM_RIGHT}
          toastClassName='dark-toast'
          progressClassName='transparent-progress'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  userModal: PropTypes.object.isRequired,
  closeUserModal: PropTypes.func.isRequired
}

const wrappedCoreLayout = compose(withIntl, withAuth(false), firebaseConnect(({ auth }) => {
  const defaultPaths = ['/honors', '/mons', '/items']
  if (auth) defaultPaths.push(`/collections/${auth.uid}`)
  return defaultPaths
}))(CoreLayout)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCoreLayout)
