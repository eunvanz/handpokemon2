import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import validator from 'validator'
import { fromJS } from 'immutable'
import keygen from 'keygenerator'
import { findIndex } from 'lodash'
import { toast } from 'react-toastify'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'
import WorkshopCard from 'components/WorkshopCard'
import CustomModal from 'components/CustomModal'
import AvatarImgInput from 'components/AvatarImgInput'
import WarningText from 'components/WarningText'
import LabelInput from 'components/LabelInput'

import { getMsg, isIE, isStringLength, dataURItoBlob } from 'utils/commonUtil'
import { WORKSHOP_IMAGE_ROOT } from 'constants/urls'

import { postImage } from 'services/ImageService'
import { postWorkshop, updateLikes, updateWhoLikes, updateWorkshop, deleteWorkshop } from 'services/WorkshopService'

import Workshop from 'models/workshop'

class WorkshopView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showRegisterModal: false,
      formData: {
        name: '',
        designer: ''
      },
      imgUrl: null, // edit모드에서만 사용
      isEditMode: false,
      isLoading: false,
      workshopToEdit: null
    }
    this._handleOnClickRegister = this._handleOnClickRegister.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickPost = this._handleOnClickPost.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickRegister () {
    this.setState({ showRegisterModal: true, isEditMode: false, imgUrl: null })
  }
  _handleOnClickPost () {
    const { messages, locale, firebase, auth } = this.props
    const { formData, isEditMode, imgUrl, workshopToEdit } = this.state
    const { name, designer } = formData
    if ((isStringLength(name) > 20 || isStringLength(name) < 1) &&
    (isStringLength(designer) > 20 || isStringLength(designer) < 1)) {
      return window.swal({ text: getMsg(messages.workshop.limitString, locale) })
    }
    if (!window.editor) return window.swal({ text: getMsg(messages.workshop.requireImage, locale) })
    this.setState({ isLoading: true })
    let dealImage
    if (!imgUrl) {
      const dataURI = window.editor.getImageScaledToCanvas().toDataURL()
      const blob = dataURItoBlob(dataURI)
      const file = new File([blob], keygen._(), { type: blob.type })
      dealImage = () => postImage(firebase, WORKSHOP_IMAGE_ROOT, [file])
    } else dealImage = () => Promise.resolve()
    dealImage()
    .then(res => {
      const imgUrl = this.state.imgUrl || res[0].File.downloadURL
      const workshop = !isEditMode ? new Workshop() : workshopToEdit
      workshop.name = formData.name
      workshop.designer = formData.designer
      workshop.designerUid = auth.uid
      workshop.img = imgUrl
      if (!isEditMode) return postWorkshop(firebase, workshop)
      else return updateWorkshop(firebase, workshop)
    })
    .then(() => {
      toast(getMsg(messages.workshop.registerComplete, locale))
      this.setState({ isLoading: false, showRegisterModal: false })
    })
    .catch(msg => {
      this.setState({ isLoading: false })
      window.swal({ text: `${getMsg(messages.workshop.registerFailed, locale)} - ${msg}` })
    })
  }
  _handleOnChangeInput (e) {
    let { name, value } = e.target
    value = validator.blacklist(value, ' ')
    const formData = fromJS(this.state.formData)
    this.setState({ formData: formData.set(name, value).toJS() })
  }
  _handleOnClickLike (e, work) {
    e.stopPropagation()
    const { auth, messages, locale, firebase } = this.props
    if (!auth) return window.swal({ text: getMsg(messages.common.requiredLogin, locale) })
    if (findIndex(work.whoLikes, e => e === auth.uid) > -1) { // 이미 좋아요를 누른 경우
      updateLikes(firebase, work.id, -1)
      .then(() => {
        return updateWhoLikes(firebase, work.id, auth.uid, 'remove')
      })
    } else {
      updateLikes(firebase, work.id, 1)
      .then(() => {
        return updateWhoLikes(firebase, work.id, auth.uid, 'push')
      })
    }
  }
  _handleOnClickEdit (work) {
    this.setState({ formData: { name: work.name, designer: work.designer }, imgUrl: work.img, showRegisterModal: true, isEditMode: true, workshopToEdit: work })
  }
  _handleOnClickDelete (work) {
    console.log('work', work)
    const { firebase, messages, locale } = this.props
    deleteWorkshop(firebase, work)
    .then(() => {
      window.swal({ text: getMsg(messages.common.success, locale) })
    })
    .catch(msg => {
      window.swal({ text: getMsg(messages.common.fail, locale) })
    })
  }
  render () {
    const { messages, locale, auth, works, user } = this.props
    const { showRegisterModal, formData, isLoading, imgUrl } = this.state
    const renderWorkshops = () => {
      if (works.length === 0) return <CenterMidContainer bodyComponent={<span>{getMsg(messages.workshop.empty, locale)}</span>} />
      return (
        works.map(work => <WorkshopCard item={work} user={user} auth={auth} key={work.id}
          onClickLike={(e) => this._handleOnClickLike(e, work)} onClickEdit={() => this._handleOnClickEdit(work)}
          onClickDelete={() => this._handleOnClickDelete(work)}
          />)
      )
    }
    const renderFooter = () => {
      return (
        <div>
          <Button disabled={isLoading} link text={getMsg(messages.common.close, locale)} onClick={() => this.setState({ showRegisterModal: false })} />
          <Button loading={isLoading} className='m-l-5' text={`${getMsg(messages.common.post, locale)}`} onClick={this._handleOnClickPost} />
        </div>
      )
    }
    const renderBody = () => {
      return (
        <div className='row m-t-20'>
          {renderWorkshops()}
          <CustomModal
            title={getMsg(messages.workshop.register, locale)}
            bodyComponent={
              <div className='text-center'>
                {!isIE() && <AvatarImgInput image={imgUrl} onChangeImage={() => this.setState({ imgUrl: null })} />}
                {isIE() && <WarningText text={getMsg(messages.common.noIE, locale)} />}
                <div className='form-horizontal m-t-30'>
                  <LabelInput
                    label={getMsg(messages.workshop.pokemonName, locale)}
                    id='name'
                    name='name'
                    type='text'
                    onChange={this._handleOnChangeInput}
                    value={formData.name}
                    length={6}
                    fontSize='md'
                    floating
                  />
                  <LabelInput
                    label={getMsg(messages.workshop.designerName, locale)}
                    id='designer'
                    name='designer'
                    type='text'
                    onChange={this._handleOnChangeInput}
                    value={formData.designer}
                    length={6}
                    fontSize='md'
                    floating
                  />
                </div>
              </div>
            }
            show={showRegisterModal}
            close={() => this.setState({ showRegisterModal: false })}
            width={350}
            id='workRegisterModal'
            footerComponent={renderFooter()}
          />
        </div>
      )
    }
    const renderHeader = () => {
      return (
        <div>
          {
            !auth &&
            <h2 style={{ paddingRight: '60px' }}>{getMsg(messages.workshop.requiredLogin, locale)}</h2>
          }
          {
            auth &&
            <div>
              <h2 style={{ paddingRight: '60px' }}>{getMsg(messages.workshop.promote, locale)}</h2>
              <ul className='actions' style={{ right: '20px' }}>
                <li><Button icon='zmdi zmdi-brush' text={getMsg(messages.workshop.register, locale)} color='blue' onClick={this._handleOnClickRegister} /></li>
              </ul>
            </div>
          }
        </div>
      )
    }
    return (
      <ContentContainer
        title={getMsg(messages.sidebar.workshop, locale)}
        body={renderBody()}
        header={renderHeader()}
        actionHeader
      />
    )
  }
}

WorkshopView.contextTypes = {
  router: PropTypes.object.isRequired
}

WorkshopView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  works: PropTypes.array.isRequired
}

export default WorkshopView
