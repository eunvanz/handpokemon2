// import React from 'react'
// import PropTypes from 'prop-types'
// import shallowCompare from 'react-addons-shallow-compare'
// import { Editor as DraftEditor } from 'react-draft-wysiwyg'
// import { EditorState, convertToRaw } from 'draft-js'
// import draftToHtml from 'draftjs-to-html'

// import Selectbox from 'components/Selectbox'
// import Button from 'components/Button'

// import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// import { getMsg } from 'utils/commonUtil'

// import Board from 'models/Board'

// import { postBoard } from 'services/BoardService'

// class Editor extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       editorState: EditorState.createEmpty(),
//       // editorState: {},
//       title: '',
//       category: 'free',
//       isLoading: false,
//       isEdited: false
//     }
//     this._handleOnChangeEditorState = this._handleOnChangeEditorState.bind(this)
//     this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
//     this._handleOnClickSave = this._handleOnClickSave.bind(this)
//     this._onCallbackUploadImage = this._onCallbackUploadImage.bind(this)
//   }
//   shouldComponentUpdate (nextProps, nextState) {
//     return shallowCompare(this, nextProps, nextState)
//   }
//   _handleOnChangeEditorState (editorState) {
//     this.setState({ isEdited: true })
//     this.setState({ editorState })
//   }
//   _handleOnChangeInput (e) {
//     this.setState({ [e.target.name]: e.target.value })
//   }
//   _handleOnClickSave () {
//     this.setState({ isLoading: true })
//     const { user, firebase, locale } = this.props
//     const { editorState, category, title } = this.state
//     const currentContent = editorState.getCurrentContent()
//     // const currentContent = editorState
//     const content = draftToHtml(convertToRaw(currentContent)).replace('<img', '<img style="max-width: 100%;"')
//     const preview = currentContent.getPlainText().slice(0, 50)
//     const board = Object.assign({}, new Board(), { writer: user, category, content: { [locale]: content }, title: { [locale]: title }, preview: { [locale]: preview } })
//     postBoard(firebase, board)
//     .then(() => {
//       this.setState({ isLoading: false })
//     })
//   }
//   _onCallbackUploadImage (file) {
//     return new Promise(
//       (resolve, reject) => {
//         const xhr = new XMLHttpRequest()
//         xhr.open('POST', 'https://api.imgur.com/3/image')
//         xhr.setRequestHeader('Authorization', 'Client-ID 3573e0629638cc1')
//         const data = new FormData()
//         data.append('image', file)
//         xhr.send(data)
//         xhr.addEventListener('load', () => {
//           const response = JSON.parse(xhr.responseText)
//           resolve(response)
//         })
//         xhr.addEventListener('error', () => {
//           const error = JSON.parse(xhr.responseText)
//           reject(error)
//         })
//       }
//     )
//   }
//   render () {
//     const { editorState, category, title, isLoading } = this.state
//     const { messages, locale } = this.props
//     return (
//       <div>
//         <div className='row'>
//           <div className='col-sm-3 col-md-2'>
//             <Selectbox
//               name='category'
//               options={[
//                 { name: getMsg(messages.board.notice, locale), value: 'notice' },
//                 { name: getMsg(messages.board.free, locale), value: 'free' },
//                 { name: getMsg(messages.board.guide, locale), value: 'guide' }
//               ]}
//               value={category}
//               onChange={this._handleOnChangeInput}
//               defaultValue='카테고리'
//             />
//           </div>
//           <div className='col-sm-9 col-md-10'>
//             <div className='input-group m-b-20 w-100'>
//               <div className='fg-line'>
//                 <input type='text' className='form-control'
//                   placeholder={getMsg(messages.board.title, locale)}
//                   value={title}
//                   name='title'
//                   onChange={this._handleOnChangeInput} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <DraftEditor
//           localization={{ locale }}
//           editorClassName='draft-editor'
//           initialEditorState={editorState}
//           // initialContentState={editorState}
//           onEditorStateChange={this._handleOnChangeEditorState}
//           // onContentStateChange={this._handleOnChangeEditorState}
//           toolbar={{
//             image: {
//               uploadCallback: this._onCallbackUploadImage
//             }
//           }}
//         />
//         <div className='row m-t-20'>
//           <div className='col-xs-12 text-right'>
//             <Button loading={isLoading} icon='fa fa-check' text={getMsg(messages.common.post, locale)} onClick={this._handleOnClickSave} />
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// Editor.contextTypes = {
//   router: PropTypes.object.isRequired
// }

// Editor.propTypes = {
//   firebase: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired,
//   messages: PropTypes.object.isRequired,
//   locale: PropTypes.string.isRequired
// }

// export default Editor
