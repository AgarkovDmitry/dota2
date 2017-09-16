export default (matches: Array<any>, heroes: Array<number>, team_id: number) => {
  const res = matches.reduce(
    (res, match) => {
      const team = match.dire_team_id == team_id ? 1 : 0
      const picks = match.picks_bans.filter(item => item.team == team && item.is_pick == true)

      const werePicked = heroes.reduce(
        (result, hero) => result && picks.reduce((a, b) => a || b.hero_id == hero, false),
        true
      )

      if (werePicked)
        return { wins: res.wins + +(match.radiant_win != team), matches: [...res.matches, match.match_id] }
      else
        return res
    },
    {
      wins: 0,
      matches: []
    }
  )

  return { ...res, heroes, winRate: res.wins / res.matches.length, picks: res.matches.length }
}