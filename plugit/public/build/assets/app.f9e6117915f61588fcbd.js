webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(66);

	var _reactRedux = __webpack_require__(39);

	var _CounterApp = __webpack_require__(101);

	var _CounterApp2 = _interopRequireDefault(_CounterApp);

	var _configureStore = __webpack_require__(104);

	var _configureStore2 = _interopRequireDefault(_configureStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = (0, _configureStore2.default)();

	(0, _reactDom.render)(_react2.default.createElement(
	  _reactRedux.Provider,
	  { store: store },
	  _react2.default.createElement(_CounterApp2.default, null)
	), document.getElementById('app'));

/***/ },

/***/ 62:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.increment = increment;
	exports.decrement = decrement;
	exports.incrementIfOdd = incrementIfOdd;
	exports.incrementAsync = incrementAsync;
	var INCREMENT_COUNTER = exports.INCREMENT_COUNTER = 'INCREMENT_COUNTER';
	var DECREMENT_COUNTER = exports.DECREMENT_COUNTER = 'DECREMENT_COUNTER';
	//导出加一的方法
	function increment() {
	  return {
	    type: INCREMENT_COUNTER
	  };
	}
	//导出减一的方法
	function decrement() {
	  return {
	    type: DECREMENT_COUNTER
	  };
	}
	//导出奇数加一的方法，该方法返回一个方法，包含dispatch和getState两个参数，dispatch用于执行action的方法，getState返回state
	function incrementIfOdd() {
	  return function (dispatch, getState) {
	    //获取state对象中的counter属性值
	    var _getState = getState();

	    var counter = _getState.counter;

	    //偶数则返回

	    if (counter % 2 === 0) {
	      return;
	    }
	    //没有返回就执行加一
	    dispatch(increment());
	  };
	}
	//导出一个方法,包含一个默认参数delay,返回一个方法,一秒后加一
	function incrementAsync() {
	  var delay = arguments.length <= 0 || arguments[0] === undefined ? 1000 : arguments[0];

	  return function (dispatch) {
	    setTimeout(function () {
	      dispatch(increment());
	    }, delay);
	  };
	}

	//这些方法都导出,在其他文件导入时候,使用import * as actions 就可以生成一个actions对象包含所有的export

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Counter = function (_Component) {
	  _inherits(Counter, _Component);

	  function Counter() {
	    _classCallCheck(this, Counter);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Counter).apply(this, arguments));
	  }

	  _createClass(Counter, [{
	    key: 'render',
	    value: function render() {
	      //从组件的props属性中导入四个方法和一个变量
	      var _props = this.props;
	      var increment = _props.increment;
	      var incrementIfOdd = _props.incrementIfOdd;
	      var incrementAsync = _props.incrementAsync;
	      var decrement = _props.decrement;
	      var counter = _props.counter;
	      //渲染组件，包括一个数字，四个按钮

	      return _react2.default.createElement(
	        'p',
	        null,
	        'Clicked: ',
	        counter,
	        ' times',
	        ' ',
	        _react2.default.createElement(
	          'button',
	          { onClick: increment },
	          '+'
	        ),
	        ' ',
	        _react2.default.createElement(
	          'button',
	          { onClick: decrement },
	          '-'
	        ),
	        ' ',
	        _react2.default.createElement(
	          'button',
	          { onClick: incrementIfOdd },
	          'Increment if odd'
	        ),
	        ' ',
	        _react2.default.createElement(
	          'button',
	          { onClick: function onClick() {
	              return incrementAsync();
	            } },
	          'Increment async'
	        )
	      );
	    }
	  }]);

	  return Counter;
	}(_react.Component);
	//限制组件的props安全


	Counter.propTypes = {
	  //increment必须为fucntion,且必须存在
	  increment: _react.PropTypes.func.isRequired,
	  incrementIfOdd: _react.PropTypes.func.isRequired,
	  incrementAsync: _react.PropTypes.func.isRequired,
	  decrement: _react.PropTypes.func.isRequired,
	  //counter必须为数字，且必须存在
	  counter: _react.PropTypes.number.isRequired
	};

	exports.default = Counter;

/***/ },

/***/ 101:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _redux = __webpack_require__(28);

	var _reactRedux = __webpack_require__(39);

	var _Counter = __webpack_require__(100);

	var _Counter2 = _interopRequireDefault(_Counter);

	var _counter = __webpack_require__(62);

	var CounterActions = _interopRequireWildcard(_counter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//将state.counter绑定到props的counter
	function mapStateToProps(state) {
	  return {
	    counter: state.counter
	  };
	}
	// //将action的所有方法绑定到props上
	// function mapDispatchToProps(dispatch) {
	//   return bindActionCreators(CounterActions, dispatch);
	// }

	//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
	exports.default = (0, _reactRedux.connect)(mapStateToProps, CounterActions)(_Counter2.default);

/***/ },

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = counter;

	var _counter = __webpack_require__(62);

	//reducer其实也是个方法而已,参数是state和action,返回值是新的state
	function counter() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case _counter.INCREMENT_COUNTER:
	      return state + 1;
	    case _counter.DECREMENT_COUNTER:
	      return state - 1;
	    default:
	      return state;
	  }
	}

/***/ },

/***/ 103:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _redux = __webpack_require__(28);

	var _counter = __webpack_require__(102);

	var _counter2 = _interopRequireDefault(_counter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//使用redux的combineReducers方法将所有reducer打包起来
	var rootReducer = (0, _redux.combineReducers)({
	  counter: _counter2.default
	});

	exports.default = rootReducer;

/***/ },

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = configureStore;

	var _redux = __webpack_require__(28);

	var _reduxThunk = __webpack_require__(198);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _reducers = __webpack_require__(103);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//applyMiddleware来自redux可以包装 store 的 dispatch
	//thunk作用是使被 dispatch 的 function 会接收 dispatch 作为参数，并且可以异步调用它
	function configureStore(initialState) {
	  var store = (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), window.devToolsExtension ? window.devToolsExtension() : function (f) {
	    return f;
	  }));

	  //热替换选项
	  if (false) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('../reducers', function () {
	      var nextReducer = require('../reducers');
	      store.replaceReducer(nextReducer);
	    });
	  }

	  return store;
	}

/***/ },

/***/ 198:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch;
	    var getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	exports['default'] = thunk;

/***/ }

});