import * as React from 'react'
import { observer } from 'mobx-react'

const styles = require('./style.scss')

interface Props{
  handleClick: Function
  children: any
  disabled?: boolean
  className?: string
}

@observer
export default class Button extends React.Component<Props, null>{
  render() {
    return (
      <button
        onClick={e => this.props.handleClick()}
        className={this.props.className ? `${styles.button} ${this.props.className}` : styles.button}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    )
  }
}