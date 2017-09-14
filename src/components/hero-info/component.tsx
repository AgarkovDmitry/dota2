import * as React from 'react'

const styles = require('./style.scss')

export default ({ hero, heroStat, bans, picks, wins }) => (
  hero
  ? <div className={styles.flexContainer}>
    <div className={styles.container}>
      <h1 className={styles.title}>{hero.localized_name}</h1>

      <div>
        <div className={styles.headContainer}>
          <div className={styles.statTitle}>Player</div>
          <div className={styles.statValue}>Wins</div>
          <div className={styles.statValue}>Picks</div>
          <div className={styles.statValue}>WR</div>
          <div className={styles.statValue}>Bans</div>
        </div>
        {
          heroStat.map(stat => (
            <div className={styles.statContainer} key={stat.account_id}>
              <div className={styles.statTitle}>{stat.name}</div>
              <div className={styles.statValue}>{stat.wins}</div>
              <div className={styles.statValue}>{stat.picks}</div>
              <div className={styles.statValue}>{(100 * stat.wins / stat.picks).toFixed(0)}%</div>
            </div>
          ))
        }

        <div className={styles.statContainer}>
          <div className={styles.statTitle}>Team</div>
          <div className={styles.statValue}>{wins}</div>
          <div className={styles.statValue}>{picks}</div>
          <div className={styles.statValue}>{picks ? (100 * wins / picks).toFixed(0) : 0}%</div>
          <div className={styles.statValue}>{bans}</div>
        </div>
        <div className={styles.statContainer}>
          <div className={styles.statTitle}>All teams</div>
          <div className={styles.statValue}>{hero.pro_win}</div>
          <div className={styles.statValue}>{hero.pro_pick}</div>
          <div className={styles.statValue}>{(100 * hero.pro_win / hero.pro_pick).toFixed(0)}%</div>
          <div className={styles.statValue}>{hero.pro_ban}</div>
        </div>
      </div>
    </div>
  </div>
  : null
)