// import { observer, inject } from 'mobx-react'
import { compose } from 'recompose'

// import Loader from 'components/others/loader'

import Component from './component'

export default compose(
  // inject('data', 'socket'),
  // lifecycle({
  //   componentDidMount() {
  //     const { data, socket } = this.props
  //     data.products.data.length || socket.fetchProducts()
  //   }
  // }),
  // observer
)(Component)