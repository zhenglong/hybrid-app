
var app = angular.module('CollectionApp', ['ngRoute', 'AppModule']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/collections/', {
			templateUrl: '../views/application/collections.html',
			controller: 'CollectionsCtrler'
		})
		.when('/collection/:id/', {
			templateUrl: '../views/application/collection.detail.html',
			controller: 'CollectionDetailCtrler'
		})
		.otherwise({
			redirectTo: '/collections/'
		});
}]);
app.controller('CollectionsCtrler', ['$scope', '_http', '_APP', 
		function($scope, http, _APP) {
	var _titleFormat = '今日催收({0})';
	var actions = {
		initialize: 'test/json/application/collections.json'
	};
	$scope.CollectionStatus = {
		Fraud:0
	};
	$scope.title = _titleFormat.format(0);
	$scope.list = [];
	function onInitialize() {
		http.get(actions.initialize, function(result) {
			$scope.list = result.data;
			$scope.title = _titleFormat.format(result.data.length);
		}, _APP.err._GetList);
	}
	onInitialize();
}]);
app.controller('CollectionDetailCtrler', ['$scope', '$routeParams',  '_APP', '_http',
		function($scope, http, $routeParams, _APP, _http) {
	var actions = {
		initialize: 'test/json/application/collections.json?id=',
		collect: 'test/json/application/collect.json',
		withdraw: 'test/json/application/withdraw.json'
	};
	$scope.title = '催收详细信息';
	$scope.item = null;
	$scope.collectionComment = null;
	$scope.withdrawComment = null;
	$scope.isWithdraw = true;
	$scope.onSubmitCollection = function() {
		http.post(actions.collect, {appId:$scope.installmentInfo.Id, 
				formContent: {"Record":$scope.collectionComment}, type: 'Record'},
			function(json) {
				if (!$scope.item.CollectionRecord) $scope.item.CollectionRecord = [];
				$scope.item.CollectionRecord.unshift({Date: json.data.DateAdded, 
					Content: $scope.collectionComment, 
					MerchantUserName:json.data.RecordBy});
				$scope.collectionComment = null;
			});
	};
	$scope.onSubmitWithdraw = function() {
		http.post(actions.withdraw, {appId:$scope.installmentInfo.Id,
			formContent: {Withdraw: $scope.onSubmitWithdraw}, type:'withdraw'}, function(json) {
			$scope.isWithdraw = false;
			$scope.item.CollectionRecord.unshift({Date: json.data.DateAdded, 
				Content: $scope.collectionComment, 
				MerchantUserName:json.data.RecordBy});
			$scope.withdrawComment = null;
		}, _APP.err._GetInfo);
	};
	function onInitialize() {
		http.get(actions.initialize + $routeParams.id, function(result) {
				if (result.status) {
					alert(result.msg);
				} else {
					$scope.item = result.data;
				}
			}, _APP.err._GetList);
	}
	onInitialize();
}]);
