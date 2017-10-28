import * as React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'

import Button from 'components/button'
import TextInput from 'components/text-input'

import Team from 'store/types/team'

const styles = require('./style.scss')

interface Props{
  close: Function
  history?: any
  teams?: Team[]
  setTeam?: (number) => void
}

@inject(({ store, pageStore }) => ({ teams: store.dataStore.teams.data, setTeam: pageStore.setTeam }))
@withRouter
@observer
export default class ChooseTeamBody extends React.Component<Props, null>{
  @observable filter: string = ''

  @action update = (e) => this.filter = e.target.value

  chooseTeam = (team) => {
    this.props.close()
    this.props.history.push(`/teams/${team.id}`)
    this.props.setTeam(team.id)
  }

  render() {
    const { close, teams } = this.props

    return (
      <div className={styles.container}>
        <TextInput placeholder={'Search team'} update={this.update}/>
        <ul className={styles.teams}>
          {
            teams
            .filter(team => team.name.toLowerCase().includes(this.filter.toLowerCase()))
            .map((team, key) => (
              <li onClick={() => this.chooseTeam(team)} key={team.id} className={styles.team}>
                {key + 1}. { team.name } - { team.winRate }%
              </li>
            ))
          }
        </ul>
        <Button handleClick={close} className={styles.button}> Close </Button>
      </div>
    )
  }
}