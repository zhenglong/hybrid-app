;(function(win, doc, undefined) {
    var Task = angular.module('D1QrCode', ['ngTouch', 'AppModule']);

    Task.controller('QrCodeCtrler', ['$scope', '$location', '$document', '$timeout',  '$http', '_loading', '_APP', '_wxService', '_',
        function($scope, $location, $document, $timeout, $http, _loading, _APP, _wxService, _) {
			$scope.product = null;
			$scope.products = [];
			$scope.onCheck = function(e) {
				if ($(e.currentTarget).hasClass('checked')) return;
				$('.product-list label.checked').removeClass('checked');
				$(e.currentTarget).addClass('checked');
			};
			$scope.onGenerateQrCode = function() {
				$document[0].title = _.find($scope.products, function(p) {
					return p.code == $scope.product;
				}).name + '优惠码';
				_loading.show();
				$http.get('test/json/D1Task/QrCode.json?productId='+ $scope.product)
					.success(function(json) {
						var title = '', content;
						if (json.status === 0) {
							content = '<img style="display: block;margin: 0 auto; max-width: 100%;" src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket={0}">'.format(json.data.qrcode);
						} else {
							title = '提示信息';
							content = '<p style="text-align:center;font-size:1.25em;" class="text-info">{0}</p>'.format(json.msg);
						}
						_APP.confirm(title, content, function() {
							$document[0].title = '产品出码';
						});
						_loading.hide();
					}).error(function(data, status, headers, config) {
						alert(_APP.err._SubmitForm + status);
					});
			};
			function onInitialize() {
				$($document[0].documentElement).removeClass('ng-initializing');
				_loading.show();
				$http.get('test/json/D1Task/GetProduct.json', {'id':$location.search().d3Id}).success(function(json) {
					var title = '', content;
					if (json.status === 0) {
						$scope.products = json.data;
					} else {
						alert(json.msg);
					}
					_loading.hide();
				}).error(function(data, status, headers, config) {
					alert(_APP.err._SubmitForm + status);
				});
			}
			$timeout(onInitialize, 0);
        }
    ]);
})(window, document);
