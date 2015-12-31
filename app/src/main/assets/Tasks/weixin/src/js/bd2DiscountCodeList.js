var app = angular.module('D3DiscountCodeListApp', ['AppModule']);
app.controller('D3DiscountCodeListCtrler', ['$scope', '$location', '$document', '$timeout', '_http', '_APP', function($scope, $location, $document, $timeout, http, APP) {
	var actions = {
		getSummary: 'test/json/BDTask/GetPromoCodeUsage.json/?id=',
	};
	$scope.list = [];
	function onInitialize() {
		$($document[0].documentElement).removeClass('ng-initializing');
		http.get(actions.getSummary + ($location.search().id || ''), function(result) {
			$scope.list = result.data;
		}, APP.err._GetInfo);
	}

	$timeout(onInitialize, 0);
}]);
