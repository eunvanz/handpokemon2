import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import CustomModal from 'components/CustomModal'
import Button from 'components/Button'
import Loading from 'components/Loading'
import UserInfo from 'components/UserInfo'

class UserModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props)) || !is(fromJS(nextState), fromJS(this.state))
  }
  render () {
    const { show, user, isLoading, close, isMyself, showCollectionButton, ...restProps } = this.props
    const renderBody = () => {
      if (isLoading) return <Loading text='트레이너 정보를 불러오는 중...' height={400} />
      return (
        <UserInfo user={user} />
      )
    }
    const renderFooter = () => {
      return (
        <div className='text-right'>
          {showCollectionButton && <Button text='콜렉션 구경' color='green' onClick={() => this.context.router.push(`/collection/${user.id}`)} />}<Button link text='닫기' onClick={close} />
        </div>
      )
    }
    return (
      <CustomModal
        title='트레이너 프로필'
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        show={show}
        close={close}
        backdrop
        {...restProps}
      />
    )
  }
}

UserModal.contextTypes = {
  router: PropTypes.object.isRequired
}

UserModal.propTypes = {
  user: PropTypes.object,
  isMyself: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  isLoading: PropTypes.bool,
  showCollectionButton: PropTypes.bool
}

export default UserModal
