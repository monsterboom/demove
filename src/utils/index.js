export const utils = {
  output() {
    return {
      debounce: this._debounce
    }
  },

  _debounce(fn, delay) {
    //设置定时器，用来执行settimeout
    var timer;
    // 返回一个函数，这个函数会在延迟时间delay(ms)之后执行
    if (typeof fn != "function" || typeof delay != 'number') {
      // alert(fn);
      return;
    }
    return function() {
      // 保存函数调用时的上下文和参数，传递给 fn
      var _this = this
      var args = arguments
      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer)
      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
      // 再过 delay 毫秒就执行 fn
      timer = setTimeout(function() {
        fn.apply(_this, args)
      }, delay)
    }
  },

}

export default {
  install(Vue) {
    Vue.prototype.$utils = utils.output()
  }
}
