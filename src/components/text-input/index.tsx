import * as React from 'react'
import { observer } from 'mobx-react'

const styles = require('./style.scss')

interface Props{
  update: any
  placeholder: string
  autoFocus?: boolean
  className?: string
}

@observer
export default class TextInput extends React.Component<Props, null>{
  render() {
    return (
      <input
        type='text'
        placeholder={this.props.placeholder}
        onChange={this.props.update}
        autoFocus={this.props.autoFocus}
        className={this.props.className ? `${styles.textInput} ${this.props.className}` : styles.textInput}
      />
    )
  }
}