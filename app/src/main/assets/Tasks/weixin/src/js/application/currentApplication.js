;(function(win, doc, undefined) {
	$(doc).bind("mobileinit", function(){
		$.extend($.mobile, {
			hashListeningEnabled: false,
			pushStateEnabled: false,
			autoInitializePage: false
		});
	});
var app = angular.module('CurrentApplicationApp', ['ngRoute', 'AppModule']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/currentApplication/', {
			templateUrl: '../views/application/currentApplication.html',
			controller: 'CurrentApplicationCtrler'
		})
		.when('/alert/:appId/', {
			templateUrl: '../views/application/currentApplication.alert.html',
			controller: 'AlertCtrler'
		})
		.otherwise({
			redirectTo: '/currentApplication/'
		});
}]);
app.controller('CurrentApplicationCtrler', ['$scope', '$window', '$document', '$interval', '$location', '$compile', '_http', '_APP', 
		function($scope, $window, $document, $interval, $location, $compile, http, _APP) {
	var _titleFormat = '今日申请({0})';
	var actions = {
		initialize: '../test/json/Application/List.json',
		recommend: '../test/json/Application/RecommendApplicationByAffiliate.json',
		getCurrentWarningStoreNames: '../test/json/Application/GetCurrentWarningStoreNames.json',
        accessableUIForList: '../test/html/Application/AccessableUIForList.html',
	};
	$scope.ApplicationStatus = {
		Canceled: 0,
		Rejected: 1,
		Completed: 2
	};
	$scope.title = _titleFormat.format(0);
	$scope.$watch('title', function(newV) {
		$document[0].title = newV;
	});
	$scope.appList = [];
	$scope.lastRefreshMinute = 0;
	$scope.onRefreshPage = function() {
		$window.location.reload();
	};
	$interval(function() {
		$scope.lastRefreshMinute += 1;
		if (($scope.lastRefreshMinute % 5) === 0) $window.location.reload();
	}, 60000);
	$scope.currentApp = null;
	$scope.recommandComment = null;
	$scope.hasPermission = false;
	$scope.currentWarningStoreList = null;
	$scope.onSwitchTab = function(e, tab) {
		$('.tab-active').toggleClass('tab-active hide');
		$(tab).toggleClass('tab-active hide');
		$(tab).trigger('show');
		e.preventDefault();
	};
	$('#currentWarningMerchantStoreNames').on('show', function() {
		if ($scope.currentWarningStoreList === null) {
			http.get(actions.getCurrentWarningStoreNames, function(result) {
				$scope.currentWarningStoreList = result.data;
			}, _APP.err._GetList);
		}
	});
	$scope.onShowItemDetails = function(e, item) {
		$scope.currentApp = item;
		e.preventDefault();
	};
	$scope.onRecommend = function() {
		var data = {
			appId: $scope.currentApp.App.Id,
			content: $scope.recommendComment
		};
		http.post(actions.recommend, data, function(result) {
			$scope.recommandComment = null;
			// TODO:update the currentApp's status
		});
	};
	$scope.onAlert = function(e) {
		$('#item_details').modal('hide');
		$location.path('/alert/{0}/'.format($scope.currentApp.Id));
		e.preventDefault();
	};
	function onInitialize() {
        http.get(actions.initialize, function(result) {
            $scope.appList = result.data;
            $scope.title = _titleFormat.format(($scope.appList || []).length);
            http.get(actions.accessableUIForList, function(result) {
                $scope.snippets = $(result);
                $scope.$emit('snippet-change');
            });
        }, _APP.err._GetList);
	}
	onInitialize();
}]);
app.controller('AlertCtrler', ['$scope', '$routeParams', function($scope, $routeParams) {
	var acitons = {
		report: '../test/json/Application/RejectApplicationByAffiliate.json'
	};
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
		$scope.currentCategory = $(e.target).hasClass('bg-info') ? null : category;
	};
	$scope.onSubmit = function() {
		var data;
		if ($window.confirm('警报一旦拉响便不可撤回，确定要拉响警报吗？')) {
			if (!$scope.currentCategory && (!$scope.alertComment || $scope.alertComment.trim().length < 1)) {
				$window.alert('输入数据为空！');
				return;
			}
			data = {
				appId: $scope.currentApp.id,
				actionType: $scope.currentCategory ? $scope.currentCategory.value : 200,
				content: $scope.alertComment
			};
			http.post(actions.report, data, function(result) {
				// TODO: update CurApp's status
				$('#Recommend').modal('hide');
			});
		}
	};
}]);
})(window, document);
