import React from 'react'
import PropTypes from 'prop-types'

class LabelInput extends React.Component {
  componentDidMount () {
    const $ = window.$
    $('body').on('focus', '.fg-line .form-control', function () {
      $(this).closest('.fg-line').addClass('fg-toggled')
    })

    $('body').on('blur', '.form-control', function () {
      var p = $(this).closest('.form-group, .input-group')
      var i = p.find('.form-control').val()
      if (p.hasClass('fg-float')) {
        if (i.length === 0) {
          $(this).closest('.fg-line').removeClass('fg-toggled')
        }
      } else {
        $(this).closest('.fg-line').removeClass('fg-toggled')
      }
    })
    //
    // $('.fg-float .form-control').each(function () {
    //   var i = $(this).val()
    //
    //   if (!i.length === 0) {
    //     $(this).closest('.fg-line').addClass('fg-toggled')
    //   }
    // })
  }
  render () {
    return (
      <div className={`form-group ${this.props.has ? `has-${this.props.has}` : ''} ${this.props.feedback ? 'has-feedback' : ''} ${this.props.floating ? 'fg-float' : ''}`}>
        {!this.props.floating && this.props.label &&
          <label htmlFor={this.props.id} className={`col-sm-offset-${(12 - this.props.length) / 2 - 2} col-sm-2 control-label f-700`}>
            {this.props.label}
          </label>
        }
        {this.props.labelElement &&
          <span className='input-group-addon'>
            {this.props.labelElement}
          </span>
        }
        <div className={`${this.props.length ? `col-sm-offset-${(12 - this.props.length) / 2}` : ''} col-sm-${this.props.length ? this.props.length : 10} ${this.props.floating ? 'fg-float' : ''}`} style={{ float: 'none' }}>
          <div className={`fg-line ${this.props.floating && this.props.value !== '' ? 'fg-toggled' : ''}`}>
            <input type={this.props.type} className={`form-control${this.props.fontSize ? ` input-${this.props.fontSize}` : ''}`} name={this.props.name}
              id={this.props.id} placeholder={this.props.placeholder} onChange={this.props.onChange}
              value={this.props.value} onBlur={this.props.onBlur} disabled={this.props.disabled} step={this.props.step}
            />
            {
              this.props.floating &&
              <label className='fg-label f-700'>{this.props.label}</label>
            }
          </div>
          {this.props.has === 'error' &&
            <span className='zmdi zmdi-close form-control-feedback' />
          }
          {this.props.has === 'success' &&
            <span className='zmdi zmdi-check form-control-feedback' />
          }
          {this.props.helper && this.props.has &&
            <small className='help-block'>{this.props.helper}</small>
          }
        </div>
      </div>
    )
  }
}

LabelInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  feedback: PropTypes.bool,
  has: PropTypes.string,
  helper: PropTypes.string,
  onBlur: PropTypes.func,
  length: PropTypes.number,
  floating: PropTypes.bool,
  labelElement: PropTypes.element,
  fontSize: PropTypes.string,
  step: PropTypes.number,
  disabled: PropTypes.bool
}

export default LabelInput
