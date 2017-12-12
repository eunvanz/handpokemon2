import React from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'

const foldDefaultStyle = {
  transition: `max-height 300ms ease-in-out`,
  maxHeight: '0',
  display: 'block',
  width: '100%',
  overflow: 'hidden'
}

const foldTransitionStyle = {
  entering: { maxHeight: '0' },
  entered: { maxHeight: '300px' } // maxHeight를 동적으로 적용할 수 없어 사용하지 못하고 있음
}

export default class Fold extends React.PureComponent {
  render () {
    const { un, children } = this.props
    return (
      <Transition in={un} timeout={0}>
        {(state) => (
          <div style={{
            ...foldDefaultStyle,
            ...foldTransitionStyle[state]
          }}>
            {children}
          </div>
        )}
      </Transition>
    )
  }
}

Fold.propTypes = {
  un: PropTypes.bool,
  children: PropTypes.element.isRequired
}
