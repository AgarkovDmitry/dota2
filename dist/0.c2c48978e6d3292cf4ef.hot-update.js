webpackHotUpdate(0,{

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mobx_react_1 = __webpack_require__(8);
var recompose_1 = __webpack_require__(6);
// import Loader from 'components/others/loader'
var component_1 = __webpack_require__(79);
exports.default = recompose_1.compose(mobx_react_1.inject('data', 'socket'), recompose_1.lifecycle({
    componentDidMount: function () {
        var _a = this.props, data = _a.data, socket = _a.socket;
        data.products.data.length || socket.fetchProducts();
    }
}), mobx_react_1.observer)(component_1.default);


/***/ })

})