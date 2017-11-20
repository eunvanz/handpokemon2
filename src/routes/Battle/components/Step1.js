import React from 'react'
import PropTypes from 'prop-types'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'

class Step1 extends React.PureComponent {
  render () {
    const { user, onClickStart } = this.props
    const renderBody = () => {
      if (user.battleCredit > 0) {
        return (
          <div>
            <h4>시합을 시작할 준비가 됐나?<br />시합이 시작된 이후에 도망친다면 패배처리되니 조심하라구.</h4>
            <Button text='시합시작!' onClick={onClickStart} />
          </div>
        )
      } else {
        return (
          <div>
            <h4>시합 크레딧이 부족하군. 조금 기다렸다가 다시 도전해보라구.</h4>
          </div>
        )
      }
    }
    return (
      <ContentContainer
        title='시합준비'
        body={<CenterMidContainer bodyComponent={renderBody()} />}
      />
    )
  }
}

Step1.contextTypes = {
  router: PropTypes.object.isRequired
}

Step1.propTypes = {
  user: PropTypes.object,
  onClickStart: PropTypes.func.isRequired
}

export default Step1
