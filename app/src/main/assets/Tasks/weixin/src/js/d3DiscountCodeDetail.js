var app = angular.module('D3DiscountCodeListApp', ['AppModule']);
app.controller('D3DiscountCodeListCtrler', ['$scope', '$location', '$document', '$timeout', '_http', '_APP', function($scope, $location, $document, $timeout, http, APP) {
	$document[0].title = '{0} {1}月统计'.format($location.search().productName, (new Date()).getMonth() + 1);
	var actions = {
		getSummary: 'test/json/D3Task/GetPromoCodeUsage.json/?d3Id={0}&productId={1}',
		getDetail: 'test/json/D3Task/GetPromoCodeUsageDetail.json/?d3Id={0}&productId={1}'
	};
	$scope.totalCount = 0;
	$scope.available = 0;
	$scope.usedList = [];
	$scope.inUseList = [];
	$scope.onSwitchTab = function(e, tab) {
		$('.tab-active').toggleClass('tab-active hide');
		$(tab).toggleClass('tab-active hide');
		$('.cf-navbar .active').toggleClass('active');
		$(e.currentTarget).toggleClass('active');
	};

	function onInitialize() {
		$($document[0].documentElement).removeClass('ng-initializing');
		var search = $location.search();
		http.get(actions.getSummary.format(search.d3Id || '', search.productId || '') , 
			function(result) {
				var data = (result.data && result.data.length) ? result.data[0] : [];
				$scope.totalCount = data.total;
				$scope.available = data.total - data.used - data.inUse;
		}, APP.err._GetInfo, false);
		http.get(actions.getDetail.format(search.d3Id || '', search.productId || ''), function(result) {
			function sortDate(a, b) {
				if (a.useDate > b.useDate) return -1;
				else if (a.useDate < b.useDate) return 1;
				else return 0;
			}
			$scope.usedList = (result.data.used || []).sort(sortDate);
			$scope.inUseList = (result.data.inUse || []).sort(sortDate);
		}, APP.err._GetList);
	}

	$timeout(onInitialize, 0);
}]);
