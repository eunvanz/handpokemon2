import React from 'react'
import PropTypes from 'prop-types'

class TextArea extends React.Component {
  componentDidMount () {
    const { $, autosize } = window
    if ($('.auto-size')[0]) {
      autosize($('.auto-size'))
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.value.length > this.props.maxLength) return false
    else return true
  }
  render () {
    const autoSizeStyle = () => {
      if (this.props.autoSize) {
        return { overflow: 'hidden', wordWrap: 'break-word', henght: '79px' }
      } else {
        return {}
      }
    }
    return (
      <div className='form-group'>
        <div className='fg-line'>
          <textarea
            className={`form-control ${this.props.autoSize ? 'auto-size' : ''}`}
            placeholder={this.props.placeholder}
            style={Object.assign({}, autoSizeStyle, this.props.style || {})}
            onChange={this.props.onChange}
            id={this.props.id}
            name={this.props.name}
            value={this.props.disableEnter ? this.props.value.replace('\n', '') : this.props.value}
          />
        </div>
        <p className='text-right'><small>{this.props.value.length}/{this.props.maxLength}</small></p>
      </div>
    )
  }
}

TextArea.propTypes = {
  autoSize: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  disableEnter: PropTypes.bool
}

export default TextArea
