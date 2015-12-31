var app = angular.module('D3DiscountCodeListApp', ['AppModule']);
app.controller('D3DiscountCodeListCtrler', ['$scope', '$location', '$document', '$timeout', '_http', '_APP', function($scope, $location, $document, $timeout, http, APP) {
	var actions = {
		getSummary: 'test/json/BDTask/GetPromoCodeInfo.json/?bdId={0}&productId={1}',
	};
	$scope.list = [];
	var search = $location.search();
	$scope.productName = search.productName;
	$scope.productId = search.productId;
	$scope.title = '{0} {1}月统计'.format($scope.productName, (new Date()).getMonth() + 1);
	$scope.$watch('title', function(newV) {
		$document[0].title = newV;
	});
	function onInitialize() {
		$($document[0].documentElement).removeClass('ng-initializing');
		http.get(actions.getSummary.format($location.search().id || '',$scope.productId), function(result) {
			$scope.list = result.data;
		}, APP.err._GetInfo);
	}

	$timeout(onInitialize, 0);
}]);
