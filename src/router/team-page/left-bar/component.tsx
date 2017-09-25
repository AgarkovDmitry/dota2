import * as React from 'react'

const styles = require('./style.scss')

export default ({ team, fetchMatches, matchesLength, loading, history }) => (
  team
  ? <div className={styles.leftBar}>

      <div className={styles.fetchContainer}>
        {
          !loading
          ? <button onClick={(fetchMatches)}>
            <div>Load more matches</div>
            {matchesLength}
          </button>
          : <button>
            <div>Loading...</div>
          </button>
        }
      </div>

      <div className={styles.filtersContainer}>
      </div>

      <div className={styles.teamContainer}>
        <button onClick={() => history.push('/teams')}> Back to all teams </button>
      </div>
  </div>
  : null
)