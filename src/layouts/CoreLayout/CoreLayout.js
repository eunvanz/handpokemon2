import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { fromJS, is } from 'immutable'
import { compose } from 'recompose'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { sortBy } from 'lodash'

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Footer from 'components/Footer'
import UserModal from 'components/UserModal'
import TutorialModal from 'components/TutorialModal'

import withAuth from 'hocs/withAuth'
import withIntl from 'hocs/withIntl'

import { closeUserModal } from 'store/userModal'
import { setTutorialModal } from 'store/tutorialModal'

import { convertMapToArr, showAlert } from 'utils/commonUtil'

const mapStateToProps = state => ({
  userModal: state.userModal,
  luckies: sortBy(convertMapToArr(dataToJS(state.firebase, 'luckies')), item => !item.regDate),
  releaseInfo: dataToJS(state.firebase, 'releaseInfo'),
  tutorialModal: state.tutorialModal
})

const mapDispatchToProps = {
  closeUserModal,
  setTutorialModal
}

class CoreLayout extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickCloseTutorialModal = this._handleOnClickCloseTutorialModal.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.luckies && prevProps.luckies.length !== 0 && prevProps.luckies.length !== this.props.luckies.length) {
      const getTypeName = type => {
        if (type === 'signUp') return '초기픽'
        else if (type === 'pick') return '채집'
        else if (type === 'mix') return '교배'
        else if (type === 'evolution') return '진화'
      }
      const getMonName = collection => {
        let result = ''
        if (collection.rank === 'S' || collection.rank === 'SS') {
          result += `${collection.rank}랭크 `
        }
        if (collection.grade === 'e') result += '엘리트 '
        else if (collection.grade === 'l') result += '레전드 '
        result += collection.mon[collection.monId].name[this.props.locale]
        return result
      }
      const lucky = this.props.luckies[this.props.luckies.length - 1]
      toast.success(`${lucky.user.nickname}님이 ${getTypeName(lucky.type)}에서 ${getMonName(lucky.collection)}을(를) 얻었습니다!`)
    }
  }
  _handleOnClickCloseTutorialModal () {
    showAlert({
      title: '튜토리얼을 종료 하시겠습니까?',
      text: '내 설정에서 튜토리얼모드를 다시 켤 수 있습니다.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    })
    .then(() => {
      setTutorialModal({
        show: false
      })
    }, () => {})
  }
  render () {
    const { children, messages, locale, userModal, closeUserModal, releaseInfo, tutorialModal } = this.props
    if (!releaseInfo) return <div>Checking Version...</div>
    return (
      <div>
        <Helmet
          title='Hand Pokémon'
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
              'href': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
            },
            {
              'rel': 'stylesheet',
              'href': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
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
            {React.Children.map(children, child => React.cloneElement(child, { messages, locale, releaseInfo }))}
          </section>
          <Footer messages={messages} locale={locale} releaseInfo={releaseInfo} />
        </section>
        <UserModal
          {...userModal}
          close={closeUserModal}
          showCollectionButton
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
        <TutorialModal
          content={tutorialModal.content}
          close={this._handleOnClickCloseTutorialModal}
          show={tutorialModal.show}
          onClickContinue={tutorialModal.onClickContinue}
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
  closeUserModal: PropTypes.func.isRequired,
  luckies: PropTypes.array,
  releaseInfo: PropTypes.object
}

const wrappedCoreLayout = compose(withIntl, withAuth(false), firebaseConnect(({ auth }) => {
  const defaultPaths = ['/honors', '/mons', '/items', '/luckies', '/releaseInfo']
  if (auth) defaultPaths.push(`/collections/${auth.uid}`)
  return defaultPaths
}))(CoreLayout)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedCoreLayout)
