import { render } from 'react-dom'

import Store from 'store'
import app from 'components/others/app'

declare global {
  interface Window { store: any }
}

const store = window.store = new Store()

render(app({ store }), document.getElementById('Main'))
