;(function(win, doc, undefined) {
	$(doc).bind("mobileinit", function(){
		$.extend($.mobile, {
			hashListeningEnabled: false,
			pushStateEnabled: false,
			autoInitializePage: false
		});
	});
	
	var app = angular.module('CollectionApp', ['ngRoute', 'AppModule']);
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/collections/', {
				templateUrl: '../views/application/collections.html',
				controller: 'CollectionsCtrler',
				reloadOnSearch: false
			})
			.when('/app/:appId/collection/:collectionId/', {
				templateUrl: '../views/application/collectionDetail.html',
				controller: 'CollectionDetailCtrler',
				reloadOnSearch: false
			})
			.when('/collectionNote/:id/', {
				templateUrl: '../views/application/collectionNote.html',
				controller: 'CollectionNoteCtrler'
			})
			.when('/collection/:appId/iou/', {
				templateUrl: '../views/application/iou.html',
				controller: 'IouCtrler'
			})
			.when('/collection/:collectionId/attorneyLetter/', {
				templateUrl: '../views/application/attorneyLetter.html',
				controller: 'AttorneyLetterCtrler'
			})
			.when('/collection/:appId/repair/', {
				templateUrl: '../views/application/repairUserInfo.html',
				controller: 'RepairUserInfoCtrler'
			})
			.otherwise({
				redirectTo: '/collections/'
			});
	}])
	.config(['$locationProvider', function($locationProvider) {
		//$locationProvider.html5Mode(true);
	}]);
	var CollectionStatus = {
		new:1,
		collected: 2,
		withdrawed: 3
	};
	app.controller('AttorneyLetterCtrler', ['$scope', '$routeParams', '_http', function($scope, $routeParams, http) {
		var actions = {
			initialize: '../test/json/Collection/AttorneyLetter.json'
		};
		function onInitialize() {
			http.get(actions.initialize, {collectionId: $routeParams.collectionId}, function(result) {
				//$('#letter').contents().find('html').html(result.data);
				var doc = $('#letter')[0].contentWindow.document;
				doc.open('text/htmlreplace');
				doc.write(result.data);
				doc.close();
			});
		}

		onInitialize();
	}]);
	app.controller('RepairUserInfoCtrler', ['$scope', '$window', '$location', '$routeParams', '_http', '_', 
			function($scope, $window, $location, $routeParams,  http, _) {
		var actions = {
			getRelationshipEnum: '../test/json/Collection/RelationshipEnum.json',
			submit: '../test/json/Collection/RepairUserInfo.json'
		};
		$scope.item = {
			appId: $routeParams.appId,
			bankAccount: null,
			address: null,
			telNo: null,
			contacts: []
		};
		$scope.contact = {
			name: null,
			telNo: null,
			relationship: '',
			relationshipText: ''
		};
		$scope.relationships = null;
		
		function resetContact() {
			var $this = $scope.contact;
			$this.name = $this.telNo = null;
			$this.relationship = $this.relationshipText = undefined;
		}
		$scope.onAddContact = function(e) {
			if ($scope.contactForm.$invalid) return;
			$scope.contact.relationshipText = _.find($scope.relationships, function(r) {
				return r.value == $scope.contact.relationship;
			}).text;
			$scope.item.contacts.push(angular.extend({}, $scope.contact));
			$($(e.currentTarget).closest('.modal')).modal('hide');
			resetContact();
			
		};
		$scope.onRemoveContact = function(contact) {
			$scope.item.contacts.splice($scope.item.contacts.indexOf(contact), 1);
		};
		$scope.onRepairUserInfo = function() {
			var item = $scope.item;
			if (!item.bankAccount && !item.address && !item.telNo && (!item.contacts || !item.contacts.length)) {
				alert('请至少填写一项信息进行修复');
				return;
			}
			http.post(actions.submit, $scope.item, function(result) {
				$window.history.back();
				$location.replace();
				$location.url($routeParams.backUrl);
			});
		};

		function onInitialize() {
			http.get(actions.getRelationshipEnum, function(result) {
				$scope.relationships = result.data;
			});
		}

		onInitialize();
	}]);
	app.controller('IouCtrler', ['$scope', '$routeParams', '$window', '_http', '_APP', 
			function($scope, $routeParams, $window, http, _APP) {
		var actions = {
			initialize: '../test/json/Collection/Iou.json'
		};
		$scope.imgData = null;
		var minWidth = $window.innerWidth;
		function onInitialize() {
			http.get(actions.initialize, {appId: $routeParams.appId}, function(result) {
				$scope.imgData = result.data;
				var $photo = $('#photo');
				$photo.attr('width', minWidth);
				var mc = new Hammer.Manager($photo[0], {
					recognizers: [[Hammer.Pinch], [Hammer.Swipe]]
				});
				var curSize = {
					w: 0,
					h: 0
				};
				var body = document.body;
				mc.on('swipeleft swiperight', function(ev) {
					body.scrollLeft -= ev.deltaX;
				});
				mc.on('swipeup swipedown', function(ev) {
					body.scrollTop -= ev.deltaY;
				});
				mc.on('pinchstart', function(e) {
					curSize.w = $photo.attr('width');
					curSize.h = $photo.attr('height');
				});
				mc.on('pinchmove', function(e) {
					$photo.attr('width', curSize.w * e.scale);
					$photo.attr('height', curSize.h * e.scale);
				});
			}, _APP._GetInfo);
		}
		onInitialize();
	}]);
	app.controller('CollectionsCtrler', ['$scope', '$sce', '$document', '$window', '$location', '$timeout', '$routeParams', '_http', '_APP', 
			function($scope, $sce, $document, $window, $location, $timeout, $routeParams, http, _APP) {
		var _titleFormat = '今日催收({0})';
		var actions = {
			initialize: '../test/json/Collection/CollectionsSummary.json',
			list: '../test/json/Collection/List.json',
		};
		$scope.CollectionStatus = CollectionStatus;
		$scope.OverdueStatus = {
			first: 1,
			second: 2,
			third: 3
		};
		$scope.CollectionState = {
			all: 1000
		};
		$scope.emptyWords = null;
		$scope.overdueStatus = $scope.OverdueStatus.first;
		$scope.collectionStatus = CollectionStatus.new;
		$scope.$watch('overdueStatus', function(newV) {
			$scope.overdueStatusText = _getOverdueStatusText(newV);
		});
		$scope.$watch('collectionStatus', function(newV) {
			switch(parseInt(newV, 10)) {
				case CollectionStatus.new:
					$scope.emptyWords = $sce.trustAsHtml('亲你好棒哟！</br>目前没有待催收用户呢</br>继续加油哦！');
					break;
				case CollectionStatus.withdrawed:
					$scope.emptyWords = $sce.trustAsHtml('亲，目前还没有退案记录！');
					break;
				case CollectionStatus.collected:
					$scope.emptyWords = $sce.trustAsHtml('亲，目前还没有催回记录！');
					break;
			}
		});
		$scope.overdueStatusText = null;
		$scope.title = _titleFormat.format(0);
		$scope.$watch('title', function(newValue) {
			$document[0].title = newValue;
		});
		$scope.$watch('$routeChangeStart', function() {
			$('.modal-backdrop.in').remove();
		});
		$scope.onDisplay = function(e, actionType, value) {
			$document[0].body.scrollTop = 0;
			var $cur = $(e.currentTarget);
			$location.replace();
			$cur.closest('ul').find('.ui-btn-active').removeClass('ui-btn-active');
			$cur.addClass('ui-btn-active');
			switch (actionType) {
				case 'overdueStatus':
					$scope.overdueStatus = value;
					$location.search('overdueStatus', $scope.overdueStatus);
					$timeout(onInitialize, 0);
					break;
				case 'collectionStatus':
					$scope.collectionStatus = value;
					$location.search('collectionStatus', $scope.collectionStatus);
					$scope.list = null;
					if ($scope.lists[value].list !== null && $scope.lists[value] !== undefined) $scope.list = $scope.lists[value].list;
					else {
						http.get(actions.list, {
							overdueBegin: $scope.overdueStatus,
							collectionStatus: $scope.collectionStatus,
							userId: $routeParams.userId,
							affiliateId: $routeParams.affiliateId
						}, function(result) {
							$scope.lists[value].list = result.data || [];
							$scope.list = $scope.lists[value].list;
						});
					}
					break;
			}
			e.preventDefault();
		};

		$scope.list = null;
		$scope.lists = {};

		function _resetLists() {
			var properties = Object.getOwnPropertyNames($scope.CollectionStatus);
			for(var i = 0; i < properties.length; i++) {
				$scope.lists[$scope.CollectionStatus[properties[i]]] = {
					list: null,
					count: 0
				};
			}
		}
		function _getOverdueStatusText(status) {
			var overdueStatusEnum = $scope.OverdueStatus;
			switch(status) {
				case overdueStatusEnum.first:
					return '首逾';
				case overdueStatusEnum.second:
					return '二逾';
				case overdueStatusEnum.third:
					return '三逾';
			}
		}

		function _makeItemVisible(appId) {
			var marginTop = parseInt($('#collections-form').css('margin-top'), 10);
			var $item = $('#item_' + appId);
			if (!$item.length) return;
			var offset = $item.offset();
			var scrollTop = $document[0].body.scrollTop; 
			if ((offset.top - marginTop) > scrollTop) $document[0].body.scrollTop = offset.top - marginTop; 	
		}
		function onInitialize() {
			_resetLists();
			if ($routeParams.overdueStatus !== undefined) $scope.overdueStatus = $routeParams.overdueStatus;
			if ($routeParams.collectionStatus !== undefined) $scope.collectionStatus = $routeParams.collectionStatus;
			http.get(actions.initialize, {
				overdueBegin: $scope.overdueStatus,
				userId: $routeParams.userId,
				affiliateId: $routeParams.affiliateId
			}, function(result) {
				var data = result.data;
				var collectionStatusEnum = $scope.CollectionStatus;
				$scope.lists[collectionStatusEnum.new].count = data.totalCount;
				$scope.lists[collectionStatusEnum.collected].count = data.collectedCount;
				$scope.lists[collectionStatusEnum.withdrawed].count = data.withdrawedCount;
				$scope.title = _titleFormat.format(data.totalCount);

				http.get(actions.list, {
					overdueBegin: $scope.overdueStatus,
					collectionStatus: $scope.collectionStatus,
					userId: $routeParams.userId,
					affiliateId: $routeParams.affiliateId
				}, function(result) {
					$scope.lists[$scope.collectionStatus].list = result.data;
					$scope.list = result.data;
					$scope.lists[$scope.collectionStatus].count = result.data.length;
					// fetch lastItemId
					var lastItemId = $window.sessionStorage.getItem('lastItemId');
					// remove lastItemId from sessionStorage
					if (lastItemId) {
						$timeout(function() {
							$window.sessionStorage.removeItem('lastItemId');
							_makeItemVisible(lastItemId);
						}, 0);
					}
				}, _APP.err._GetList);
			}, _APP.err._GetList, false);
		}
		onInitialize();
	}]);
	app.controller('CollectionDetailCtrler', ['$scope', '$window', '$timeout', '$location', '$routeParams', '$sce', '$compile', '$document', '_APP', '_http', '_',
			function($scope, $window, $timeout, $location, $routeParams, $sce, $compile, $document, _APP, http, _) {
		var actions = {
			initialize: '../test/json/Collection/CollectionDetail.json?appId={0}&collectionId={1}',
			collect: '../test/json/Collection/Collect.json',
			listHistory: '../test/json/Collection/UserInfoModificationHistory.json',
			btnList: '../test/html/Collection/BtnList.html'
		};
		$scope.serverUrl = $window.serverBaseUrl; 
		$scope.title = '催收详细信息';
		$scope.item = null;
		$scope.isTelNoUpdated = false;
		$scope.isLivingAddressUpdated = false;
		$scope.isBankAccountUpdated = false;
		$scope.collectionStatus = $routeParams.collectionStatus;
		$scope.infoStatus = {
			new: 1
		};
		$scope.CollectionStatus = CollectionStatus;
		$scope.backUrl = encodeURIComponent($location.url().replace('tab=two', 'tab=one'));
		$scope.recordsLen = 0;
		$scope.btnList = '';

		$scope.history = null;
		var isHistoryFetched = false;
		$scope.onShowHistory = function() {
			if (isHistoryFetched) return;
			http.get(actions.listHistory, {
				userId: $scope.item.clientUser.userId, 
				appId: $routeParams.appId}, 
				function(result) {
					isHistoryFetched = true;
					$scope.history = result.data;
			});
		};
		$scope.onClickTab = function(e) {
			$document[0].body.scrollTop = 0;
			$location.replace();
			$location.search('tab', $(e.currentTarget).attr('href').substr(1));
		};
		$scope.$on('$routeChangeSuccess', function() {
			// set the lastItemId in sessionStorage
			$window.sessionStorage.setItem('lastItemId', $routeParams.collectionId);
		});
		$scope.collectionId = $routeParams.collectionId;
		function onInitialize() {
			var tabName = $location.search().tab;
			$timeout(function() {
				if (angular.isString(tabName)) {
					$('.head-bar a[href="#{0}"]'.format(tabName)).click();
				}
			}, 0);
			http.get(actions.initialize.format($routeParams.appId, $routeParams.collectionId), function(result) {
				var clientUser = result.data.clientUser;
				if (clientUser.status) {
					$scope.isTelNoUpdated = checkStatus(clientUser.status, 'telNo');
					$scope.isLivingAddressUpdated = checkStatus(clientUser.status, 'livingAddress');
					$scope.isBankAccountUpdated = checkStatus(clientUser.status, 'bankInfo');
				}
				function checkStatus(status, key) {
					var s = _.find(status, function(item) {
						return item.key == key;
					});
					return ((s && s.status) == $scope.infoStatus.new);
				}
				result.data.collectionRecord = result.data.collectionRecord.sort(function(o1, o2) {
					var d1 = new Date(o1.date);
					var d2 = new Date(o2.date);
					if (d1 > d2) return -1;
					else if (d1 < d2) return 1;
					else return 0;
				});
				$scope.item = result.data;
				$scope.item.appId = $routeParams.id;
				$scope.recordsLen = $scope.item && $scope.item.collectionRecord && $scope.item.collectionRecord.length;
			}, _APP.err._GetList);
			if ($scope.collectionStatus == CollectionStatus.new) {
				http.get(actions.btnList, function(result) {
					if (!result || !result.length) return;
					$scope.btnList = $sce.trustAsHtml(result);
					$timeout(function() {
						$compile($('#btnList').contents())($scope);
					}, 0);
				});
			}
		}
		onInitialize();
	}]);
	app.controller('CollectionNoteCtrler', ['$scope', '$routeParams', '$window', '$interval', '_APP', '_http', '_', 
			function($scope, $routeParams, $window, $interval,  _APP, http, _) {
		var collectionStatus = {
			record: '记录',
			withdraw: '退案'
		};
		var actions = {
			getConfiguration: '../test/json/Collection/CollectionEnums.json',
			collect: '../test/json/Collection/Collect.json',
		};
		$scope.title = collectionStatus[$routeParams.type] + ' - ' + $routeParams.name;

		$scope.collectionWays = null;
		$scope.customerCatalogs = null;
		$scope.collectionResults = null; 
		$scope.agreedPayWays = null;
		$scope.failedToCollect = null;
		$scope.item = {
			collectionWay: null,
			customerCatalog: null,
			collectionResult: null,
			agreedPayDate: null,
			agreedPayWay: null,
			comment: null
		};
		$scope.$watch('item.collectionResult', function(newV) {
			validateAgreedPayDate($scope.item.agreedPayDate);
			validateAgreedPayWay($scope.item.agreedPayWay);
		});
		$scope.onCheck = function(e) {
			$cur = $(e.currentTarget);
			if ($cur.hasClass('checked')) return;
			$cur.closest('.radio-list').find('label.checked').removeClass('checked');
			$cur.addClass('checked');
		};
		function formValidate() {
			validateAgreedPayDate($scope.item.agreedPayDate);
			validateAgreedPayWay($scope.item.agreedPayWay);
			var item = $scope.item;
			var result = item.collectionWay && item.customerCatalog && item.collectionResult;
			if (item.collectionResult != $scope.failedToCollect.value) {
				result = result && item.agreedPayDate && item.agreedPayWay;
			}
			return result;
		}
		function validateAgreedPayWay(v) {
			if (!$scope.failedToCollect) return;
			var collectionResult = $scope.item.collectionResult;
			var isError = (collectionResult !== null && collectionResult != $scope.failedToCollect.value) && !v;
			var $parent = $('#agreedPayWay').closest('.ui-btn');
			if (isError) $parent.addClass('error');
			else $parent.removeClass('error');
		}
		$scope.$watch('item.agreedPayWay', function(newV) {
			validateAgreedPayWay(newV);
		});
		function validateAgreedPayDate(v) {
			if (!$scope.failedToCollect) return;
			var collectionResult = $scope.item.collectionResult;
			var isError = (collectionResult !== null && collectionResult != $scope.failedToCollect.value) && !v;
			var $parent = $('#agreedPayDate').closest('.ui-input-text');
			if (isError) $parent.addClass('error');
			else $parent.removeClass('error');
		}
		$scope.$watch('item.agreedPayDate', function(newV) {
			validateAgreedPayDate(newV);
		});
		$scope.onSubmit = function() {
			if (!formValidate()) {
				_APP.confirm(null, '确保已填写所有必填字段!');
				return;
			}
			var param = angular.extend({}, 
				{ collectionId:$routeParams.id, type: $routeParams.type }, $scope.item);
			http.post(actions.collect, param, function(json) {
				$window.history.back();
			}, _APP.err._SubmitForm);
		};
		$scope.onCancel = function() {
			$window.history.back();
		};
		function onInitialize() {
			http.get(actions.getConfiguration, function(result) {
				$scope.collectionWays = result.data.collectionWays;
				$scope.customerCatalogs = result.data.customerCatalogs;
				$scope.collectionResults = result.data.collectionResults;
				$scope.agreedPayWays = result.data.agreedPayWays;
				$scope.failedToCollect = _.find($scope.collectionResults, function(r) {
					return r.text == '催收失败';
				});
				var $agreedPayDate = $('#agreedPayDate');
				$interval(function() {
					$scope.item.agreedPayDate = $agreedPayDate.val();
				}, 120);
			}, _APP.err._GetList);
		}
		onInitialize();
	}]);
})(window, document);
