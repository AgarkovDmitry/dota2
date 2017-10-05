import * as React from 'react'

import Drawer from 'components/drawer'
import Loader from 'components/loader'
import ChooseTeamBody from 'components/drawer/bodies/choose-team'

const styles = require('./style.scss')

export default ({ team, fetchMatches, matchesLength, loading, chooseTeam, teams }) => (
  team
  ? <div className={styles.leftBar}>
      <div className={styles.fetchContainer}>
        <button onClick={(fetchMatches)} className={styles.teamsButton} disabled={loading}>
          {
            !loading
            ? `Load more matches(${matchesLength})`
            : <Loader/>
          }
        </button>
      </div>

      <div className={styles.filtersContainer}>
      </div>

      <div className={styles.teamContainer}>
        <Drawer
          trigger={
            ({ open }) => <button onClick={open} className={styles.teamsButton}>
              Select another team
            </button>
          }
          body={ChooseTeamBody}
        />
      </div>
  </div>
  : null
)