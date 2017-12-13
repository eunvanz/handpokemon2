import React from 'react'
import PropTypes from 'prop-types'
import { StickyContainer, Sticky } from 'react-sticky'
import shallowCompare from 'react-addons-shallow-compare'

class Card extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { header, body, headerBgColor, headerTextColor, clearPadding, stickyHeader, actionHeader, ...restProps } = this.props
    return (
      <StickyContainer>
        <div className='card' {...restProps}>
          {header && !stickyHeader &&
            <div className={`card-header${actionHeader ? ' action-header' : ''}`} style={{ backgroundColor: headerBgColor || 'white', color: headerTextColor || '#333' }}>{header}</div>}
          {
            header && stickyHeader &&
            <Sticky topOffset={-70}>
              {
                ({ style, isSticky }) => {
                  const newStyle = Object.assign({}, style, { marginTop: isSticky ? '70px' : '0px' })
                  return <div className='card-header' style={Object.assign({}, { borderBottom: '1px solid #eeeeee', backgroundColor: headerBgColor || 'white', color: headerTextColor || '#333', zIndex: '9' }, newStyle)}>{header}</div>
                }
              }
            </Sticky>
          }
          <div className={`card-body ${clearPadding ? '' : 'card-padding'}`}>
            {body}
          </div>
        </div>
      </StickyContainer>
    )
  }
}

Card.propTypes = {
  header: PropTypes.element,
  body: PropTypes.any.isRequired,
  headerBgColor: PropTypes.string,
  headerTextColor: PropTypes.string,
  clearPadding: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  actionHeader: PropTypes.bool
}

export default Card
