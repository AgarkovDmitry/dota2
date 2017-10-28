import * as React from 'react'

import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import onClickOutside from 'react-onclickoutside'

import TextInput from 'components/text-input'
import Button from 'components/button'
const styles = require('./style.scss')

interface Props{
  handleSelect: Function
  name: string
  options: Array<any>
  selected: Array<any>

  filter?: boolean
  mapObject?: Function
}

@onClickOutside
@observer
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
          this.isOpened
          ? this.props.filter
            ? <TextInput autoFocus={true} placeholder={this.props.name} update={this.update}/>
            : <Button handleClick={this.open} disabled={!this.props.filter}>{ this.props.name }</Button>
          : <Button handleClick={this.open}>{ this.props.name }</Button>
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
                  className={
                    typeof this.props.selected == 'object'
                    ? this.props.selected.find(item => item == option)
                      ? styles.selectedOption
                      : styles.option
                    : this.props.selected == option
                      ? styles.selectedOption
                      :styles.option
                  }
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