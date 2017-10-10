import * as React from 'react'
import { observable, action } from 'mobx'

import Team from 'store/types/team'

import Button from 'components/button'
import TextInput from 'components/text-input'

const styles = require('./style.scss')

interface Props{
  close: Function
  chooseTeam: Function
  teams: Array<Team>
}

export default class ChooseTeamBody extends React.Component<Props, null>{
  @observable filter: string = ''

  @action update = (e) => this.filter = e.target.value

  render() {
    const { close, teams, chooseTeam } = this.props

    return (
      <div className={styles.container}>
        <TextInput placeholder={'Search team'} update={this.update}/>
        <ul className={styles.teams}>
          {
            teams
            .filter(team => team.name.toLowerCase().includes(this.filter.toLowerCase()))
            .map((team, key) => (
              <li onClick={() => chooseTeam(team)} key={team.id} className={styles.team}>
                {key + 1}. { team.name } - { team.winRate }%
              </li>
            ))
          }
        </ul>
        <Button handleClick={e => close()} className={styles.button}> Close </Button>
      </div>
    )
  }
}