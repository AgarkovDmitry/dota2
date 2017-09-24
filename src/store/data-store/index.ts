import Matches from './matches'
import Heroes from './heroes'
import Players from './players'

class Store {
  matches = new Matches()
  heroes = new Heroes()
  players = new Players()
}

export default Store