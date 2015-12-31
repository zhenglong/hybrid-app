;(function(win, doc, undefined) {
	$(doc).bind("mobileinit", function(){
		$.extend($.mobile, {
			hashListeningEnabled: false,
			pushStateEnabled: false,
			autoInitializePage: false
		});
	});
	var app = angular.module('CollectionApp', ['AppModule']);
	
	app.controller('CollectionsByDCtrler', ['$scope', '$window', '$document', '$timeout',  '_http', 
		function($scope, $window, $document, $timeout, http) {
		var actions = {
			list: '../test/json/Collection/CollectionsSummaryByDSupervisor.json'
		};
		$scope.list = [];
		var href = $window.location.href;
		var qsStart = href.indexOf('?');
		$scope.qs = qsStart > -1 ? href.substr(qsStart) : '';
		function onPage() {
			http.get(actions.list, function(result) {
                $scope.list = result.data;
			});
		}

		function onInitialize() {
			$($document[0].documentElement).removeClass('ng-initializing');
			onPage();
		}
		$timeout(onInitialize, 0);
	}]);
})(window, document);
