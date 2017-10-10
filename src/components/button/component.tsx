import * as React from 'react'

const styles = require('./style.scss')

interface Props{
  handleClick: Function
  children: string
  disabled?: boolean
  className?: string
}

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