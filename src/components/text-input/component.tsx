import * as React from 'react'
const styles = require('./style.scss')

interface Props{
  update: any
  placeholder: string
  className?: string
}

export default class TextInput extends React.Component<Props, null>{
  render() {
    return (
      <input
        type='text'
        placeholder={this.props.placeholder}
        className={this.props.className ? `${styles.textInput} ${this.props.className}` : styles.textInput}
        onChange={this.props.update}
      />
    )
  }
}