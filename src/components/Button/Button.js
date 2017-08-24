import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import keygen from 'keygenerator'

class Button extends React.Component {
  constructor (props) {
    super(props)
    let key = keygen._()
    this.state = { key }
  }
  componentDidMount () {
    if (this.props.disabled) $(`#${this.props.id || this.state.key}`).prop('disabled', true)
    const Waves = window.Waves
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)')
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float'])
    Waves.init()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.disabled !== this.props.disabled || prevProps.loading !== this.props.loading) {
      if (this.props.disabled || this.props.loading) $(`#${this.props.id || this.state.key}`).prop('disabled', true)
      else $(`#${this.props.id || this.state.key}`).prop('disabled', false)
    }
  }
  render () {
    const style = {
      button: { padding: '8px 14px 8px 14px', fontSize: `${this.props.size === 'xs' ? '12px' : '15px'}`, fontWeight: '700' },
      icon: this.props.iconRight ? { margin: this.props.loading ? '0px' : '3px 0px 0px 6px' } : { margin: this.props.loading ? '0px' : '3px 6px 0px 0px' }
    }
    const getTextStyle = () => {
      if (this.props.iconRight && this.props.loading) {
        return { marginRight: '4px' }
      } else if (this.props.loading) {
        return { marginLeft: '4px' }
      }
    }
    return (
      <button
        id={this.props.id || this.state.key}
        className={`btn ${this.props.link ? '' : `bgm-${this.props.color || 'blue'}`} ${this.props.link ? 'btn-link' : ''} waves-effect ${this.props.size ? `btn-${this.props.size}` : ''} ${this.props.icon ? 'btn-icon-text' : ''} ${this.props.block ? 'btn-block' : ''} ${this.props.className}`}
        onClick={this.props.onClick}
        data-dismiss={this.props['data-dismiss']} style={Object.assign({}, style.button, this.props.style)}
      >
        {this.props.icon && !this.props.iconRight && <i className={this.props.loading ? 'fa fa-circle-o-notch fa-spin fa-fw' : this.props.icon} style={style.icon} />}
        <span style={getTextStyle()}>{this.props.loading ? '진행 중...' : this.props.text}</span>
        {this.props.icon && this.props.iconRight && <i className={this.props.loading ? 'fa fa-circle-o-notch fa-spin fa-fw' : this.props.icon} style={style.icon} />}
      </button>
    )
  }
}

Button.propTypes = {
  color: PropTypes.string, // cyan, teal, amber, orange, deeporange, red, pink, lightblue, blue, indigo, lime, lightgreen, green, purple, deeppurple, gray, bluegray, black
  text: PropTypes.string.isRequired,
  size: PropTypes.string, // lg, sm, xs
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  block: PropTypes.bool,
  iconRight: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.bool,
  loading: PropTypes.bool
}

export default Button
