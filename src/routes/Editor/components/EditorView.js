// import React from 'react'
// import PropTypes from 'prop-types'
// import shallowCompare from 'react-addons-shallow-compare'

// import { getMsg } from 'utils/commonUtil'

// import Editor from './Editor'
// import ContentContainer from 'components/ContentContainer'

// class EditorView extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       id: props.params.id
//     }
//   }
//   shouldComponentUpdate (nextProps, nextState) {
//     return shallowCompare(this, nextProps, nextState)
//   }
//   render () {
//     const { params, messages, locale, firebase, user, auth } = this.props
//     const { id } = params
//     const renderBody = () => {
//       return (
//         <Editor messages={messages} locale={locale} firebase={firebase}
//           user={user} auth={auth} />
//       )
//     }
//     return (
//       <ContentContainer
//         title={getMsg(messages.board.board, locale)}
//         body={renderBody()}
//       />
//     )
//   }
// }

// EditorView.contextTypes = {
//   router: PropTypes.object.isRequired
// }

// EditorView.propTypes = {
//   firebase: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired,
//   messages: PropTypes.object.isRequired,
//   locale: PropTypes.string.isRequired,
//   params: PropTypes.object.isRequired
// }

// export default EditorView
