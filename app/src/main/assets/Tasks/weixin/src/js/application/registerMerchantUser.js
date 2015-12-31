var app = angular.module('RegisterMerchantUserApp', ['ng', 'w5c.validator']);
app.controller('RegisterMerchantUserCtrler', ['$scope', '$window', '_http', function($scope, http) {
	$scope.telNo = null;
	$scope.validationCode = null;
	$scope.isSendValidationCode = false;
	var actions = {
		sendValidationCode: 'test/json/application/sendValidationCode.json',
		register: 'test/json/application/registerMerchantUser.json'
	};
	$scope.sendValidationCode = function() {
		http.post(actions.sendValidationCode, {mobile: $scope.telNo}, function() {
			$scope.isSendValidationCode = true;
		});
	};
	$scope.onRegister = function() {
		http.post(actions.register, {mobile:$scope.telNo, mobileValidationCode:$scope.validationCode,
			isSendValidationCode:$scope.isSendValidationCode}, function() {
			$window.location.href = "registerComplete.html";
		});
	};
}]);
