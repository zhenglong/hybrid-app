var app = angular.module('WithdrawApp', ['ng', 'AppModule']);
app.controller('WithdrawCtrler', ['$scope', '$window', '_http', function($scope, $window, http) {
	$scope.model = null;
	var actions = {
		initialize: 'test/json/application/withdraw.json',
		withdraw: 'test/json/application/withdraw.json'
	};
	$scope.onWithdraw = function() {
		http.post(actions.withdraw, $scope.model, function(result) {
			var url = result.data ? 'withdrawComplete.html' : 'rejectWithdraw.html';
			$window.location.href = url;
		});
	};
	function onInitialize() {
		http.get(actions.initialize, {}, function(result) {
			$scope.model = result.data;
		});
	}

	onInitialize();
}]);
