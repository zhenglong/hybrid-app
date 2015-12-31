var app = angular.module('DisplayIouApp', ["AppModule"]);
app.controller('DisplayIouCtrler', ['$scope', '$timeout', '$location', '$document', '$window', '_http', '_APP', 
		function($scope, $timeout, $location, $document, $window, http, APP) {
	var actions = {
		initialize: '../test/json/Application/GetIou.json'
	};
	$scope.title = '电子借条';
	function landscape() {
		var h = $window.innerHeight, w = $window.innerWidth;
		var needRotate = h > w;
		$($document[0].documentElement).removeClass('ng-initializing');
		var transformFmt = 'rotate({1}deg) translate{2}({0}px)';
		var $left = $('#left_column'), $right = $('#right_column'),
			height = $left.height();
		var doc = $($document[0].body),
			transformValue = transformFmt.format(-w, 90, 'Y');
		if (needRotate) {
			doc.css({width: h + 'px',height: w + 'px', 
				'-webkit-transform': transformValue, 
				'-moz-transform':transformValue, 
				transform: transformValue});
			$left.css({transform: transformFmt.format(-w, -90, 'X'), width: w + 'px'});
			$right.css({'margin-left': height + 'px', height: w + 'px'});
		} else {
			$left.css({transform: transformFmt.format(-h, -90, 'X'), width: h + 'px'});
			$right.css({'margin-left': height + 'px'});
		}
	}
	function onDeviceOrientation(e) {
		e.preventDefault();
		$timeout(landscape, 0);
	}
	function onInitialize() {
		$window.addEventListener('deviceorientation', onDeviceOrientation, true);
		http.get(actions.initialize, {appId:$location.search().appId}, function(result) {
			angular.extend($scope, result.data);
			$timeout(landscape, 0);
		},APP.err._GetInfo);
	}
	$timeout(onInitialize, 0);
}]);
