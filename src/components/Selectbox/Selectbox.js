import React from 'react'
import PropTypes from 'prop-types'

class Selectbox extends React.Component {
  render () {
    const { options, id, onChange, defaultValue, value, name } = this.props
    const renderOptions = () => {
      return options.map((option, idx) => {
        return <option key={idx} value={option.value}>{option.name}</option>
      })
    }
    return (
      <div className='form-group'>
        <div className='fg-line'>
          <div className='select'>
            <select className='form-control' id={id} name={name} onChange={onChange} value={value}
              style={{ cursor: 'pointer' }}>
              <option key='default' value=''>{defaultValue}</option>
              {renderOptions()}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

Selectbox.propTypes = {
  options: PropTypes.array.isRequired, // { name, value }
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string
}

export default Selectbox
