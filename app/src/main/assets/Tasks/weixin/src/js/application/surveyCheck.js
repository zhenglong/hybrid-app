;(function (win, doc, undefined) {
	var app = angular.module('SurveyCheckApp', ['AppModule']);
	app.controller('SurveyCheckCtrler', ['$scope', '$timeout', '$window', '$location', '$document', '_wxService', '_http', '_APP', 
		function($scope, $timeout, $window, $location, $document, _wxService, http, APP) {
		var actions = {
			initialize: '../test/json/Application/GetQuestions.json',
			uploadLocation: '../test/json/Application/UploadLocation.json',
			submit: '../test/json/Application/SurveyAnswer.json'
		};
		var timeout = 300000;
		var myTime = $timeout(tick, timeout);
		var appId = $location.search().id;
		function resetTime() {
			$timeout.cancel(myTime);
			myTime = $timeout(tick, timeout);
		}
		function tick() {
			alert("你的页面已经超时，请重新登入！");
			$window.location.reload();
		}
		$(document).on('touchstart touchend touchmove tap  ', function () {
			resetTime();
		});
		$scope.MetaQuestionType = {
			SingleChoice: 0,
			ShortAnswer: 1
		};
		$scope.onRadioClick = function(e, obj, prop) {
			$cur = $(e.currentTarget);
			if ($cur.hasClass('checked')) return;
			$cur.closest('.radio-list').find('label.checked').removeClass('checked');
			$cur.addClass('checked');
			obj[prop] = $cur.children('input[type="radio"]').attr('value');
		};
		$scope.onSubmit = function() {
			http.post(actions.submit, {
				appId: appId,
				answer: $('#question-form').serialize()
			}, function() {
				$window.history.back();
			});
		};
		function onInitialize() {
			$($document[0].documentElement).removeClass('ng-initializing');
			_wxService.getLocation(function(res) {
				var result = 'Longitude={0}&Latitude={1}&Precision={3}'.format(res.longitude, res.latitude, res.accuracy);
				http.post(actions.uploadLocation, {
					appId: $scope.appId,
					location: result
				});
			});
			http.get(actions.initialize, {
				appId: appId
			}, function(result) {
				angular.extend($scope, result.data);
			}, APP.err._GetList);
		}
		$timeout(onInitialize, 0);
	}]);
})(window, document);
