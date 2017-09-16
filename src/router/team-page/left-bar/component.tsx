import * as React from 'react'

const styles = require('./style.scss')

export default ({ team, fetchMatches, matchesLength, history }) => (
  team
  ? <div className={styles.leftBar}>

      <div className={styles.fetchContainer}>
        <button onClick={fetchMatches}>
          <div>Load more matches</div>
          {matchesLength}
        </button>
      </div>

      <div className={styles.filtersContainer}>
      </div>

      <div className={styles.teamContainer}>
        <button onClick={() => history.push('/teams')}> Back to all teams </button>
      </div>
  </div>
  : null
)