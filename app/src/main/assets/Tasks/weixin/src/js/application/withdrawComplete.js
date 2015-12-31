var app = angular.module('WithdrawCompleteApp', ['ng']);
app.controller('WithdrawCtrler', ['$scope', '$location', function($scope, $location) {
	$scope.model = $location.search();

}]);
