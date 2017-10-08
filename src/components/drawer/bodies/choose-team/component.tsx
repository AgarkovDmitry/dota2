import * as React from 'react'
import { observable, action } from 'mobx'

import Team from 'store/types/team'

const styles = require('./style.scss')

interface Props{
  close: Function
  chooseTeam: Function
  teams: Array<Team>
}
/*  mapProps(
    ({ store, history, close }) => ({
      teams: store.dataStore.teams
        .sort((a, b) => b.rating - a.rating)
        .filter((item, key) => key < 100),
      chooseTeam: (team) => {
        close()
        history.push(`/teams/${team.id}`)
        store.localStore.setTeam(team.id)
      },
      close
    })
  ),*/
export default class ChooseTeamBody extends React.Component<Props, null>{
  @observable filter: string = ''

  @action update = (e) => this.filter = e.target.value

  // @computed get teams() {
  //   return this.props.store.dataStore.teams.sort((a, b) => b.rating - a.rating).filter((item, key) => key < 100)
  // }

  // chooseTeam = createTransformer((team) => {
  //   this.props.close()
  //   this.props.history.push(`/teams/${this.props.team.id}`)
  //   this.props.store.localStore.setTeam(this.props.team.id)
  // })

  render() {
    const { close, teams, chooseTeam } = this.props

    return (
      <div className={styles.container}>
        <input type='text' placeholder='Search team' className={styles.searchBox} onChange={this.update}/>
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
        <button onClick={e => close()} className={styles.button}> Close </button>
      </div>
    )
  }
}