import * as React from 'react'
import { observable, action } from 'mobx'

import TextInput from 'components/text-input'
import Button from 'components/button'
const styles = require('./style.scss')

interface Props{
  filter: boolean
  handleSelect: Function
  name: string

  options: Array<any>
  selected: Array<any>

  mapObject?: Function
}

export default class Select extends React.Component<Props, null>{
  @observable isOpened: boolean = false
  @observable filter: string = ''

  @action handleClickOutside = () => this.close()

  @action update = (e) => this.filter = e.target.value
  @action open = () => this.isOpened = true
  @action close = () => this.isOpened = false

  render() {

    return (
      <div className={styles.container}>
        {
          this.isOpened && this.props.filter
          ? <TextInput autoFocus placeholder={this.props.name} update={this.update}/>
          : <Button text={this.props.name} handleClick={this.open}/>
        }
        {
          this.isOpened
          && <div className={styles.optionsContainer}>
            {
              this.props.options
              .filter(option => (this.props.mapObject ? this.props.mapObject(option) : option).toLowerCase().includes(this.filter.toLowerCase()))
              .map((option, key) =>
                <div
                  key={key}
                  className={this.props.selected.find(item => item == option) ? styles.selectedOption : styles.option}
                  onClick={() => this.props.handleSelect(option)}
                >
                  { this.props.mapObject ? this.props.mapObject(option) : option }
                </div>
              )
            }
          </div>
        }
      </div>
    )
  }
}