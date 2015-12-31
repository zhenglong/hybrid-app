var app = angular.module('AffiliateRedPackApp', ['AppModule']);
app.controller('AffiliateRedPackCtrler', ['$scope', '$http', '$window', '$location', '_APP', '_loading', '_wxService',
		function($scope, http, $window, $location, _APP, _loading, wx) {
	var weixinRedPackReturnStatus = {
		AcitivityClosed:0,
		AlreadySent:1,
		NotSent:2,
		SentSuccess:3,
		TimeLimited:5,
		BlockByWeixin:6,
		Pending:7,
		SentFailure:8,
		MoneyNotEnough:9,
		CommunicateWeixinFailure:10
	};
	var actions = {
		redPackTryLuck: '../test/json/Application/RedPackTryLuck.json?id=',
		affiliateRedPack: '../test/json/Application/AffiliateRedPack.json?id='
	};
	var _isEggClicked = false;
	$scope.onEggClick = function (e) {
		if (_isEggClicked) return;
		_isEggClicked = true;
		var tigger = $(e.target);
		$(tigger).find('.hammerStyle').css('visibility', 'visible').addClass('hammerStyleAnimation');
		setTimeout(function () {
			$(tigger).find('.hammerStyle').addClass('hammerStyleEnd');
			$(tigger).addClass('egg1');
		}, 300);
		_loading.show();
		http.get(actions.redPackTryLuck + $location.search().id).success(function (data) {
			switch ($window.parseInt(data.data.redPackStatus))
			{
				case weixinRedPackReturnStatus.SentSuccess:
					_APP.confirm('', 'Duang! 买单侠红包来啦，请回到公众号界面领红包！');
					break;
				case weixinRedPackReturnStatus.AlreadySent:
					_APP.confirm('', '红包已经领取过啦！');
					break;
				case weixinRedPackReturnStatus.TimeLimited:
					_APP.confirm('', '不在红包领取时间，请于8:00-24:00之间领取！');
					break;
				case weixinRedPackReturnStatus.BlockByWeixin:
					_APP.confirm('', '红包被微信拦截，请确保为本人常用微信账号！');
					break;
				case weixinRedPackReturnStatus.Pending:
					_APP.confirm('', '红包已发出，如未收到，请稍后重试！');
					break;
				//case weixinRedPackReturnStatus.SentFailure:
				//case weixinRedPackReturnStatus.MoneyNotEnough:
				//case weixinRedPackReturnStatus.CommunicateWeixinFailure:
				default:
					_APP.confirm('', '红包领取失败，请稍后重试！');
					break;
			}
			setTimeout(function() {
				wx.closeWindow();
			}, 4000);
		}).error(function () {
			_APP.confirm('', '哎呀，暂时无法抽奖！');
		}).finally(function() {
			_loading.hide();
		});
	};
	var onInitialize = function() {
		_loading.show();
		http.get(actions.affiliateRedPack + $location.search().id)
			.success(function(data) {
				_loading.hide();
				switch ($window.parseInt(data.data.redPackStatus)) {
					case weixinRedPackReturnStatus.AcitivityClosed:
						_APP.confirm('','发红包活动已结束!');
						setTimeout(function () {
							wx.closeWindow();
						}, 4000);
						break;
					default:
					case weixinRedPackReturnStatus.AlreadySent:
						_APP.confirm('','不能重复抽奖哦!');
						setTimeout(function () {
							wx.closeWindow();
						}, 4000);
						break;
					case weixinRedPackReturnStatus.NotSent:
						$(".egg").css('visibility', 'visible');
						break;
				}
		});
	};
	onInitialize();
}]);
