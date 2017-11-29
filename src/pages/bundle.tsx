import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'

interface Props{
  load: (any) => any
}

@observer
export default class Bundle extends React.Component<Props, null>{
  @observable mod: any = null

  componentWillMount() {
    this.load(this.props.load)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) this.load(nextProps.load)
  }

  @action load = (load) => {
    this.mod = null
    load(mod => this.mod = mod.default ? mod.default : mod)
  }

  render() {
    const Component = this.mod
    return Component ? <Component/> : null
  }
}