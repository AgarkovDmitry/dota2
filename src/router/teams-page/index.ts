import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, lifecycle, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('teams'),
  withRouter,
  observer,
  mapProps(
    props => ({
      ...props,
      teams: props.teams.data
      .sort((a, b) => {
        if (a.rating < b.rating) return 1
        else if (a.rating > b.rating) return -1
        else return 0
      })
      .filter((item, key) => key < 50)
    })
  ),
  lifecycle({
    componentDidMount() {
      this.props.teams.fetch()
    }
  })
)(Component)