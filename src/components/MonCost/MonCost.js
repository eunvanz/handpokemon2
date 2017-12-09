import React from 'react'
import PropTypes from 'prop-types'

import { colors } from 'constants/colors'

class MonCost extends React.Component {
  render () {
    const { cost, ...rest } = this.props
    const renderCost = () => {
      const resultComponent = []
      let fullStar = null
      let emptyStar = null
      let key = 0
      for (let i = 0; i < 5; i++) {
        if (cost <= 5) {
          fullStar = <i key={key++} className='fa fa-star' />
          emptyStar = <i key={key++} className='fa fa-star' style={{ color: colors.lightGray }} />
        } else {
          fullStar = <i key={key++} className='fa fa-star c-amber' />
          emptyStar = <i key={key++} className='fa fa-star' />
        }
        if (cost === 5 || cost === 10) {
          resultComponent.push(fullStar)
        } else if (i < cost % 5) {
          resultComponent.push(fullStar)
        } else {
          resultComponent.push(emptyStar)
        }
      }
      return resultComponent
    }
    return (
      <div {...rest}>
        {renderCost()}
      </div>
    )
  }
}

MonCost.propTypes = {
  cost: PropTypes.number
}

export default MonCost
