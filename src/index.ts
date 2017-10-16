import { render } from 'react-dom'

// import registerServiceWorker from 'helpers/registerServiceWorker'
import Store from 'store'
import router from 'pages'

import * as OfflinePluginRuntime from 'offline-plugin/runtime'

declare global {
  interface Window { store: Store }
}

const store = window.store = new Store()

render(router({ store }), document.getElementById('Main'))
// registerServiceWorker()

OfflinePluginRuntime.install()