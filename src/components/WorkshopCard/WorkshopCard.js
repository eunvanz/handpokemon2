import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { compose } from 'recompose'
import { findIndex } from 'lodash'
import { FormattedDate } from 'react-intl'

import Img from 'components/Img'
import CustomModal from 'components/CustomModal'
import Button from 'components/Button'

import withIntl from 'hocs/withIntl'

import { getMsg } from 'utils/commonUtil'

import { colors } from 'constants/colors'

class WorkshopCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDetailModal: false,
      isLoading: false
    }
    this._handleOnClickEdit = this._handleOnClickEdit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
  }
  _handleOnClickEdit () {
    const { onClickEdit } = this.props
    this.setState({ showDetailModal: false })
    onClickEdit()
  }
  _handleOnClickDelete () {
    const { onClickDelete } = this.props
    this.setState({ showDetailModal: false })
    onClickDelete()
  }
  render () {
    const { item, messages, locale, auth, onClickLike } = this.props
    const { showDetailModal, isLoading } = this.state
    const renderLikeButton = () => {
      return (
        <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
          <Button link onClick={onClickLike} icon={auth && findIndex(item.whoLikes, e => e === auth.uid) > -1 ? 'fas fa-heart c-pink' : 'far fa-heart c-pink'} text={numeral(item.likes).format('0,0')} size='lg' style={{ padding: '4px 14px' }} />
        </div>
      )
    }
    const renderFooterComponent = () => {
      return (
        <div>
          {
            item.designerUid === auth.uid &&
            <Button color='red' disabled={isLoading} className='m-l-5' text={`${getMsg(messages.common.delete, locale)}`} onClick={this._handleOnClickDelete} />
          }
          {
            item.designerUid === auth.uid &&
            <Button color='orange' disabled={isLoading} className='m-l-5' text={`${getMsg(messages.common.edit, locale)}`} onClick={this._handleOnClickEdit} />
          }
          <Button disabled={isLoading} link text={getMsg(messages.common.close, locale)} onClick={() => this.setState({ showDetailModal: false })} />
        </div>
      )
    }
    return (
      <div className='col-md-2 col-sm-3 col-xs-6' style={{ padding: '0px 5px' }}>
        <div className='c-item'
          onClick={() => this.setState({ showDetailModal: true })}
          style={{
            cursor: 'pointer',
            border: '1px solid #e2e2e2',
            marginBottom: '8px',
            borderRadius: '2px',
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
            padding: '4px',
            backgroundColor: 'white'
          }}>
          <a className='ci-avatar'>
            <Img src={item.img} width='100%' style={{ border: '1px dotted #e2e2e2' }} />
          </a>
          {
            renderLikeButton()
          }
          <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
            <span className='c-lightblue f-700'>{item.name}</span>
          </div>
          <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative', fontSize: '12px' }}>
            Designed By<br /><span className='c-lightblue f-700' style={{ fontSize: '14px' }}>{item.designer}</span>
          </div>
        </div>
        <CustomModal
          title={getMsg(messages.workshop.detail, locale)}
          bodyComponent={
            <div className='text-center'>
              <Img src={item.img} width='250' />
              {renderLikeButton()}
              <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
                <span className='c-lightblue f-700'>{item.name}</span>
              </div>
              <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
                Designed By <span className='c-lightblue f-700'>{item.designer}</span>
              </div>
              <div className='c-info text-center' style={{ margin: '5px 0px', position: 'relative' }}>
                {getMsg(messages.common.regDate, locale)} <FormattedDate value={new Date(item.regDate)} year='numeric' month='numeric' day='numeric' />
              </div>
            </div>
          }
          footerComponent={
            renderFooterComponent()
          }
          show={showDetailModal}
          close={() => this.setState({ showDetailModal: false })}
          backdrop
        />
      </div>
    )
  }
}

WorkshopCard.contextTypes = {
  router: PropTypes.object.isRequired
}

WorkshopCard.propTypes = {
  item: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  onClickLike: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired
}

export default compose(withIntl)(WorkshopCard)
