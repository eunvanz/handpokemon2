import React from 'react'
import PropTypes from 'prop-types'

class Card extends React.Component {
  render () {
    const { header, body, headerBgColor, headerTextColor, clearPadding, ...restProps } = this.props
    return (
      <div className='card' {...restProps}>
        {header &&
          <div className='card-header' style={{ backgroundColor: headerBgColor || 'white', color: headerTextColor || '#333' }}>{header}</div>}
        <div className={`card-body ${clearPadding ? '' : 'card-padding'}`}>
          {body}
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  header: PropTypes.element,
  body: PropTypes.element.isRequired,
  headerBgColor: PropTypes.string,
  headerTextColor: PropTypes.string,
  clearPadding: PropTypes.bool
}

export default Card
