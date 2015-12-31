var app = anuglar.module('CurrentApplicationApp', ['AppModule']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/currentApplication/', {
			templateUrl: '../views/application/currentApplication.html',
			controller: 'CurrentApplicationCtrler'
		})
		.when('/currentWarningMerchantStoreNames/', {
			templateUrl: '../views/application/currentWarningMerchantStoreNames.html',
			controller: 'CurrentWarningMerchantStoreNamesCtrler'
		})
		.when('/displayIou/:appId/', {
			templateUrl: '../views/application/displayIou.html',
			controller: 'DisplayIouCtrler'
		})
		.otherwise({
			redirectTo: '/currentApplication/'
		});
}]);
app.controller('CurrentApplicationCtrler', ['$scope', '$window', '_http', '_APP', 
		function($scope, http, _APP) {
	var _titleFormat = '今日申请({0})';
	var actions = {
		initialize: 'test/json/application/currentApplication.json',
		report: 'test/json/application/rejectPDLApplicationByAffiliate.json'
	};
	$scope.ApplicationStatus = {
		Canceled: 0,
		Rejected: 1,
		Completed: 2
	};
	$scope.title = _titleFormat.format(0);
	$scope.list = [];
	$scope.lastRefreshMinute = 0;
	$scope.onRefreshPage = function() {
		$window.location.reload();
	};
	$interval(function() {
		$scope.lastRefreshMinute += 1;
		if (($scope.lastRefreshMinute % 5) === 0) $window.location.reload();
	}, 60000);
	$scope.MerchantUserRole = {
		D3:0
	};
	$scope.CurrentMerchantUser = null;
	$scope.CurrentApp = null;
	$scope.recommandComment = null;
	$scope.alertCategories = [{
		name: '劣质客户',
		value: 30
	}, {
		name: '信用不良',
		value: 40
	}, {
		name: '欺诈-虚假身份',
		value: 50
	}, {
		name: '欺诈-虚假信息',
		value: 60
	}, {
		name: '套现-中介',
		value: 70
	}, {
		name: '套现-个人',
		value: 80
	}, {
		name: '二手单',
		value: 90
	}];
	$scope.curentAlertCategory = null;
	$scope.alertComment = null;
	$scope.onToggleCategory = function(category, e) {
		$scope.currentCategory =$(e.target).hasClass('bg-info') ? null : category;
	};
	$scope.onRecommend = function() {
		var data = {
			appId: $socpe.CurrentApp.Id,
			content: $scope.recommandComment
		};
		http.post(actions.recommend, data, function(result) {
			$scope.recommandComment = null;
			$window.history.back();
		});
	};
	$scope.onReport = function() {
		var data;
		if ($window.confirm('警报一旦拉响便不可撤回，确定要拉响警报吗？')) {
			if (!$scope.currentCategory && (!$scope.alertComment || $scope.alertComment.trim().length < 1)) {
				$window.alert('输入数据为空！');
				return;
			}
			data = {
				appId: $scope.CurrentApp.Id,
				actionType: $scope.currentCategory ? $scope.currentCategory.value : 200,
				content: $scope.alertComment
			};
			http.post(actions.report, data, function(result) {
				$window.history.back();
			});
		}
	};
	// TODO: .extend_icon的回调函数没有转换
	function onInitialize() {
		http.get(actions.initialize, function(result) {
			$scope.list = result.data;
			$scope.title = _titleFormat.format(result.data.length);
		}, _APP.err._GetList);
	}
	onInitialize();
}]);
app.controller('CurrentWarningMerchantStoreNamesCtrler', ['$scope', '$routeParams',  '_APP', '_http',
		function($scope, http, $routeParams, _APP, _http) {
	var actions = {
		initialize: 'test/json/application/collections.json?id=',
		collect: 'test/json/application/collect.json',
		withdraw: 'test/json/application/withdraw.json'
	};
	$scope.title = '';
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
app.controller('DisplayIouCtrler', ['$scope', function($scope) {
}]);
