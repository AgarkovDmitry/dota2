import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'

const styles = require('./style.scss')

interface Props{
  trigger: any
  body: any
}

@observer
export default class MatchContainer extends React.Component<Props, null>{
  @observable isOpen: boolean = false

  @action open = () => this.isOpen = true
  @action close = () => this.isOpen = false

  render() {
    const Trigger = this.props.trigger
    const Body = this.props.body

    return (
      [
        <Trigger open={this.open}/>,
        this.isOpen && <div onClick={this.close} className={styles.overlay}/>,
        this.isOpen && <div className={styles.body}>
          <Body close={this.close}/>
        </div>
      ]
    )
  }
}