;function Bridge(native_, http) {
  var callbacks = {};
  var events = {};

  var _uuid = 1;

  function getUuid() {
    var result = _uuid;
    _uuid++;
    return result;
  }

  var bridge = {
    // @description 选择图片并上传
    // event
    // uploadStateChange - 通知图片上传状态变化
    // 事件参数
    // state: uploadState
    // data: {
    //  progress: .5 // 上传进度
    // }
    //
    //
    // @param {Object} - param {
    //  count: 1: // 允许上传的最大图片数,
    //  uploadUrl: "", // 上传地址,
    //  success: function(res) {
    //    var localIds = res.localIds; // 直接绑定到img的src属性上显示待上传图片
    // }
    // }
    chooseImage: function(params) {
      var funcId = getUuid();
      var self = this;
      var uploadState = {
        init: 1, // 开始上传
        process: 2, // 上传中
        complete: 3 // 完成上传
      };
      if (params.success) {
        callbacks[funcId] = function() {
          params.success.apply(null, arguments);
          if (!params.uploadUrl) return;
          http.post(params.uploadUrl, {}, function() {
            self.trigger('uploadStateChange', {
              state: uploadState.complete
            });
            // cleanup the registered callbacks
          });
        };
      }
      native_.displayImageChooser(funcId);
    },
	displayToast: function(str) {
		native_.displayToast(str);
	},
    on: function(event, callback) {
      if (!event || !callback) return;
      if (!events[event]) events[event] = [];
      var callbackId = getUuid();
      events[event].push({
        id: callbackId,
        cb: callback
      });
      return callbackId;
    },
    off: function(event, callbckId) {
      if (!event || !events[event]) return false;
      if (!callbackId) {
        events[event] = undefined;
        return true;
      }
      for(var i = 0; i < events[event].length; i++) {
        if (events[event][i].id == callbackId) {
          events[event].splice(i, 1);
          return true;
        }
      }
      return false;
    },
    trigger: function(event, data) {
      var len;
      if (!event || !events[event] || !(len = events[event].length)) return;
      for (var i = 0; i < len; i++) {
        events[event].cb.call(null, data);
      }
    },
    callback: function(functionId) {
      if (!callbacks[functionId] || callbacks[functionId].isCalled) return;
      callbacks[functionId].isCalled = true;
	  console.log(functionId);
	  console.log(arguments[1]);
      var args = Array.prototype.slice.call(arguments, 1);
      callbacks[functionId].apply(null, args);
    }
  }
  return bridge;
}
