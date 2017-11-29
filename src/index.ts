import * as ReactDOM from 'react-dom'

// import registerServiceWorker from 'helpers/registerServiceWorker'
import Store from 'store'
import router from 'pages'

import * as OfflinePluginRuntime from 'offline-plugin/runtime'

declare global {
  interface Window { store: Store, pageStore: any }
  interface NodeRequire { ensure: any }
}
// declare const module: any

const store = window.store = new Store()

const render = (router) => ReactDOM.render(router({ store }), document.getElementById('Main'))

render(router)

OfflinePluginRuntime.install()

// if (module.hot) {
//   module.hot.accept('./pages', () => {
//     const router = require('./pages').default
//     render(router)
//   })
// }