;(function(window, document, undefined) {
	$(function() {
		if (window.FastClick) FastClick.attach(document.body);
	});
	if (!String.prototype.format) {
			String.prototype.format = function() {
			var fmt = this;
			var params = Array.prototype.slice.call(arguments);
			return fmt.replace(/(\{(\d+)\})/g, function(match, firstCap, index) {
				return ((params[index] === undefined) ? match : params[index]);
			});
		};
	}
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return $.trim(this);
		};
	}
    var appModule = angular.module('AppModule', ['ngCookies']);
	appModule.factory('_', function() {
		return {
			grep: function(arr, cb) {
				var result = [];
				this.each(arr, function(i, item) {
					if (cb(item)) result.push(item);
				});
				return result;
			},
			sum: function(arr, getter) {
				var result = 0;
				this.each(arr, function(i, item) {
					result += parseFloat(getter(item));
				});
				return result;
			},
			map: function(arr, cb) {
				var result = [];
				this.each(arr, function(i, item) {
					result.push(cb(item));
				});
				return result;
			},
			each: function(arr, cb) {
				var i = 0, len = arr.length, res;
				while (i < len) {
					res = cb(i, arr[i]);
					if (res === false) break;
					i++;
				}
			},
			any: function(arr, cb) {
				var i = 0, len = arr.length, res = false;
				while (i < len) {
					res = cb(arr[i]);
					if (res === true) break;
					i++;
				}
				return res;
			},
			find: function(arr, cb) {
				var i = 0, len = arr.length, res = null;
				while (i < len) {
					if (cb(arr[i]) === true) {
						res = arr[i];
						break;
					}
					i++;
				}
				return res;
			}
		};
	});

    function getURLParam (oTarget, sVar) {
        return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar)
                    .replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    //appModule.config(['$provide', '_httpProvider', function($provide, _httpProvider) {
    //    $provide.decorator('$templateRequest', ['$delegate', '_http', function($delegate, _http) {
    //        return function(tpl) {
    //            // if tpl containqs withCredentials=true,
    //            // then do the request with the other way
    //            function handle() {
    //                //var _http = _httpProvider.$get();
    //                return _http.get(tpl);
    //            }
    //            //return handle();
    //            return $delegate.apply(null, arguments);
    //        }
    //    }]);
    //}]);

	appModule.factory('_http', ['$http', '$window', '_loading', function(http, $window, _loading) {
		var tokenCookieKey = 'access-token', tokenHeaderKey = 'access-token';
		var config = {
			headers: {
				'access-token':getURLParam($window.location, tokenCookieKey)
			}
		};
		return {
			ajax: function(method, url, param, successCallback, errorCategory, closeLoadingImmediate) {
				var promise = null;
				url = url.replace(/^(\.{1,2}\/)+/g, '');
				url = window.serverBaseUrl + url;
				console.log('url: ' + url);
				_loading.show();
				switch(method) {
					case 'GET':
						if (angular.isFunction(param)) {
							closeLoadingImmediate = errorCategory;
							errorCategory = successCallback;
							successCallback = param;
							param = null;
						}
						if (param && angular.isObject(param)) url = url + '?' + $.param(param);
						promise = http.get(url, config)
							.success(function(result) {
								if (result.status) {
									alert(result.msg);
								} else {
									if (successCallback) successCallback(result);
								}
							});
						break;
					case 'POST':
						promise = http.post(url, param, config)
							.success(function(result) {
								if (result.status) {
									alert(result.msg);
								} else {
									if (successCallback) successCallback(result);
								}
							});
				}
				promise.error(function(data, status, headers, config) {
						function getErrorMessage() {
							if (angular.isString(data) && data) return data;
							return (data && data.msg) || status;
						}
						if (status) alert(getErrorMessage());
						_loading.hide();
					})
					.finally(function() {
						if (closeLoadingImmediate !== false) _loading.hide();
					});
				return promise;
			},
			get: function(url, param, successCallback, errorCategory, closeLoadingImmediate) {
				if (angular.isFunction(param)) {
					errorCategory = successCallback;
					successCallback = param;
					param = null;
				}
				return this.ajax('GET', url, param, successCallback, errorCategory, closeLoadingImmediate);
			},
			post: function(url, param, successCallback, errorCategory, closeLoadingImmediate) {
				if (angular.isFunction(param)) {
					errorCategory = successCallback;
					successCallback = param;
					param = {};
				}
				return this.ajax('POST', url, param, successCallback, errorCategory, closeLoadingImmediate);
			}
		};
	}]);

    appModule.factory("_loading", function() {
        var $loading = null,
            service = {
                show: function() {
					if (!$loading || !$loading.length) $loading = $('.loading-modal');
                    $loading.show();
                },
                hide: function() {
					if (!$loading || !$loading.length) $loading = $('.loading-modal');
                    $loading.hide();
                }
            };
        return service;
    });
    appModule.factory("_pageTitle", function() {
        var service = {
            set: function(title) {
                document.title = title;
                //$('title').remove();
                //$('head').append('<title>'+title+'</title>');
                //document.getElementsByTagName('title')[0].innerHTML = title;
            }
        };
        return service;
    });
    appModule.factory("_APP",function(){

        var $commonModal,
            $commonTitle,
            $commonContent,
            $commonOK,
            $commonCancel;
        var APP = {
            phImg: null,
            err: {
                _GetList: '获取当前列表出错',
                _GetInfo: '获取详细信息出错',
                _UploadPhoto: '上传图片出错',
                _GetDefaultArea: '获取默认地区出错',
                _GetAreas: '获取地区列表出错',
                _SubmitForm: '提交表单出错',
				_Error: '错误'
            },
            confirm: function(title,content,callback){

				if (!$commonModal || !$commonModal.length) $commonModal = $('#common-modal');
				if (!$commonTitle || !$commonTitle.length) $commonTitle = $commonModal.find('.modal-title');
				if (!$commonContent || !$commonContent.length) $commonContent = $commonModal.find('.modal-body');
				if (!$commonOK || !$commonOK.length) $commonOK = $('#btn-common-ok');
				if (!$commonCancel || !$commonCancel.length) $commonCancel = $('#btn-common-cancel');

                $commonTitle.html(title || '提示');
                $commonContent.html(content);
                $commonOK.one('click',function(e){
                    if (callback) callback(true);
                    $commonCancel.off('click');
                });
                $commonCancel.one('click',function(e){
                    if (callback) callback(false);
                    $commonOK.off('click');
                });
                $commonModal.modal({
                    backdrop: 'static'
                });
            }
        };
        return APP;
    });
    appModule.factory("_wxService", ['_loading', '$http',
        function(_loading, $http) {
            var chooseOneImage = function(uploadUrl,success) {

                },
                downloadImage = function(serverId, getLocalIdCallback) {

                },
				getLocation = function(success) {

				},
                isServerId = function(photo) { //判断图片地址是否是微信serverId
                    return photo.indexOf('http://') > -1 ? false : true;
                },
                initWXSDK = function(authUri) {

                },
				closeWindow = function() {

				};
            return {
                initWXSDK: initWXSDK,
                chooseOneImage: chooseOneImage,
                downloadImage: downloadImage,
                isServerId: isServerId,
				closeWindow: closeWindow,
				getLocation: getLocation
            };
        }
    ]);
    appModule.factory('_jsTree',['$rootScope',function($rootScope){
        var service = {},
            $jsTree = $('#jsTree'),
            $jsTreeModal = $('#jsTree-modal'),
            $jsTreeBtnOK = $('#btn-jsTreeOK');

        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            $jsTreeModal.modal('hide');
        });

        service.init = function(url,selectedCallback){
            $jsTree.jstree({
                'plugins': ["wholerow", "checkbox"],
                'core': {
                    'animation': false,
                    'data': {
                        'url': url,
                        "data": function(node){
                            return {id: node.id};
                        }
                    },
                    'themes': {
                        'name': 'proton',
                        'responsive': true,
                        'icons': false
                    }
                }
            });
            $jsTreeBtnOK.one('click',function(e){
                var nodes = $jsTree.jstree(true).get_top_selected(true);
                selectedCallback(nodes);

            });
            $jsTreeModal.one('hide.bs.modal', function (e) {
                //alert('hide');
                $.jstree.destroy();
                $jsTreeBtnOK.off('click');
            });
        };


        return service;
    }]);

    appModule.directive('formateId', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(attrs.ngModel,
                    function(value,oldValue) {
                        if(typeof value === 'undefined' || (value === oldValue)) return;
                        elem.val(value.replace(/^(\d{6}(?! ))/,'$1 ').replace(/^(\d{6} \d{8}(?! ))/,'$1 '));
                    }
                );

                ctrl.$parsers.push(function (value) {
                    elem.val(value.replace(/^(\d{6}(?! ))/,'$1 ').replace(/^(\d{6} \d{8}(?! ))/,'$1 '));
                    return value;
                });
            }
        };
    });
    appModule.directive('formateMobile', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(attrs.ngModel,
                    function(value,oldValue) {
                        if(typeof value === 'undefined' || (value === oldValue)) return;
                        elem.val(value.replace(/^(\d{3}(?! ))/,'$1 ').replace(/^(\d{3} \d{4}(?! ))/,'$1 '));
                    }
                );
                ctrl.$parsers.push(function (value) {
                    elem.val(value.replace(/^(\d{3}(?! ))/,'$1 ').replace(/^(\d{3} \d{4}(?! ))/,'$1 '));
                    return value;
                });
            }
        };
    });
	appModule.directive('uploadFilePlaceholder', function() {
		return {
			template: function(elem, attrs) {
			$(elem).html('<div class="cross-line-container"><div class="h-cross-line"></div><div class="v-cross-line"></div></div><p class="description">{0}</p>'.format(attrs.title || '上传图片'));
			}
		};
	});
	appModule.directive('confirmModal', function() {
		return {
			restrict: 'AME',
			template: '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">...</h4></div><div class="modal-body"></div><div class="modal-footer"><button id="btn-common-ok" type="button" class="btn center-block btn-brand" data-dismiss="modal">&nbsp;&nbsp;&nbsp;&nbsp;关&nbsp;&nbsp;闭&nbsp;&nbsp;&nbsp;&nbsp;</button></div></div></div>',
			link: function(scope, elem, attrs) {
				elem.addClass('modal fade')
					.attr('data-backdrop', false)
					.attr('id', 'common-modal');
			}
		};
	});
	appModule.directive('loadingModal', function() {
		return {
			restrict: 'AME',
			template: '<button class="btn btn-lg btn-warning loading" disabled><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</button>',
			link: function(scope, elem, attrs) {
				elem.addClass('loading-modal');
			}
		};
	});
    //
    // usage: <!-- directive: snippet: [selector, snippets, scope] -->
    // selector and snippets is required.
    // scope is optional; if not provided, use the current scope.
    //
    // after snippets is set in the page controller, 'snippet-change' event should be triggered.
    //
    appModule.directive('snippet', ['$compile', function($compile) {
        return {
            restrict: 'M',
            template: '',
            scope: false,
            link: function(scope, elem, attrs) {
                (function(scope, elem, atts) {
                    scope.$root.$on('snippet-change', function() {
                        function getSnippet() {
                            var selector = snippetArgs[0];
                            var snippets = snippetArgs[1];
                            return $(selector, snippets.clone());
                        }
                        var snippetArgs = scope.$eval(attrs.snippet);
                        var s = getSnippet();
                        if (!s.length) return;
                        elem.replaceWith(s);
                        $compile(s)(snippetArgs[2] || scope);
                    });
                })(scope, elem, attrs);
            }
        };
    }]);
	appModule.directive('cfPage', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				$('html').removeClass('ui-mobile-rendering');
				elem.page();
				if (attrs.active === 'true') elem.addClass('ui-page-active');
			}
		};
	});
	appModule.directive('cfListview', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				elem.listview();
			}
		};
	});
	appModule.directive('cfListDivider', function() {
		return {
			restrict: 'A',
			require: '^cfListView',
			compile: function(elem, attrs) {
				//TODO get theme by data-divider-theme on ul/ol or data-theme on itself
				elem.removeClass().addClass('ui-li-divider ui-bar-a');
			}
		};
	});
	appModule.directive('cfTabs', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				elem.tabs();
			}
		};
	});
	appModule.directive('cfNavbar', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				elem.navbar();
			}
		};
	});
	appModule.directive('cfPopup', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				elem.popup();
			}
		};
	});
	appModule.directive('cfControlgroup', function() {
		return {
			restrict: 'A',
			compile: function(elem, attrs) {
				elem.controlgroup();
			}
		};
	});
})(window, document);
