import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import { addLocaleData, IntlProvider } from 'react-intl'
import flatten from 'flat'

import en from 'react-intl/locale-data/en'
import ko from 'react-intl/locale-data/ko'
import ja from 'react-intl/locale-data/ja'
import zh from 'react-intl/locale-data/zh'

addLocaleData([...en, ...ko, ...ja, ...zh])
let locale = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || 'en'

export default ComposedComponent => {
  class withIntl extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    render () {
      const { messages, ...props } = this.props
      if (!messages) return <div>Loading, Please Wait...</div>
      return (
        <IntlProvider locale={locale} messages={flatten(messages)}>
          <ComposedComponent messages={messages} locale={locale.slice(0, 2)} {...props} />
        </IntlProvider>
      )
    }
  }

  withIntl.propTypes = {
    messages: PropTypes.object
  }

  const mapStateToProps = (state) => {
    return {
      messages: dataToJS(state.firebase, 'messages')
    }
  }

  const wrappedWithIntl = firebaseConnect(['/messages'])(withIntl)

  return connect(mapStateToProps, null)(wrappedWithIntl)
}
