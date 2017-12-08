import React from 'react'
import PropTypes from 'prop-types'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'

class BattleReady extends React.PureComponent {
  render () {
    const { onClickStart, auth, creditInfo } = this.props
    const renderBody = () => {
      if (creditInfo.battleCredit > 0) {
        return (
          <div>
            <h4>시합을 시작할 준비가 됐나?<br />시합이 시작된 이후에 도망친다면 패배처리되니 조심하라구.</h4>
            <Button text='시합시작!' onClick={onClickStart} />
          </div>
        )
      } else {
        return (
          <div>
            <h4>시합 크레딧이 부족하군.<br />심심하면 교배나 진화를 통해 콜렉션을 강화해보는건 어때?</h4>
            <Button text='내 콜렉션' color='green' onClick={() => this.context.router(`/collection/${auth.uid}`)} />
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

BattleReady.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleReady.propTypes = {
  auth: PropTypes.object,
  onClickStart: PropTypes.func.isRequired,
  creditInfo: PropTypes.object.isRequired
}

export default BattleReady
