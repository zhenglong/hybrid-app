;(function(win, doc, undefined) {
    var Task = angular.module('BD2Task4S', ['ngRoute', 'ngTouch', 'w5c.validator', 'AppModule']);
    Task.run(['_wxService',function(_wxService){
        _wxService.initWXSDK('test/json/BDTask/GetAuth.json');
    }]);
    Task.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/sellerlist/', {
                templateUrl: 'views/bdtask/seller.list.html',
                controller: 'listCtrler'
            }).
            when('/seller/', {
                templateUrl: 'views/bdtask/seller.form.html',
                controller: 'SellerFormCtrler'
            }).
            when('/s3/', {
                templateUrl: 'views/bdtask/s3.form.html',
                controller: 'S3FormCtrler'
            }).
            otherwise({
                redirectTo: '/sellerlist/'
            });
        }
    ]);
    Task.config(['w5cValidatorProvider',
        function(w5cValidatorProvider) {
            // 全局配置
            w5cValidatorProvider.config({
                blurTrig: false,
                showError: true,
                removeError: true
            });
        }
    ]);

    Task.controller('listCtrler', ["$scope", "$http", "_loading", "_pageTitle", "_APP",
        function($scope, $http, _loading, _pageTitle, _APP) {
            _pageTitle.set('Seller列表');
            _loading.show();
            $http.get('test/json/BDTask/GetSellerList.json').success(function(json) {
                $scope.isDataValidate = json.status === 0 ? true : false;
                if ($scope.isDataValidate) {
                    $scope.list = json.data;
                    $scope.isEmpty = json.data.length === 0 ? true : false;
                } else {
                    alert(json.msg);
                }
                _loading.hide();
            }).error(function(data, status, headers, config) {
                alert(_APP.err._GetList + status);
            });
        }
    ]);

    Task.controller('SellerFormCtrler', ['$scope', '$routeParams', '$http', '$location', '$q',
			'_', '_loading', '_pageTitle', '_wxService', '_APP', '_jsTree',
        function($scope, $routeParams, $http, $location, $q, _, _loading, _pageTitle, _wxService, _APP, _jsTree) {
			var getCommissionUrl = 'test/json/BDTask/GetCommissionByProductId.json';
			var getProductUrl = 'test/json/BDTask/GetProduct.json';
			var getAreaProvince = 'test/json/BDTask/GetAreas_province.json?code=0';
			var getSellerUrl = 'test/json/BDTask/GetSeller.json?id=';
			var getSaleTreeUrl = 'test/json/BDTask/GetSaleTree.json';
			var getAreaCityUrl = 'test/json/BDTask/GetAreas_city.json?code=';
			var uploadPhotoUrl = 'test/json/BDTask/UploadPhoto.json';
			var submitSellerUrl = 'test/json/BDTask/SubmitSeller.json';
			var standardProductCatalog = 'POS_Standard';
            _loading.show();
            //PROVINCELIST CITYLIST BLOCKLIST 是静态存储的资源
            getLocalData('local_PROVINCELIST', getAreaProvince, 'PROVINCELIST');
            $scope.seller = angular.extend({}, {
                operate: typeof $routeParams.id === 'undefined' ? 0 : 1
            });
            if ($scope.seller.operate === 1) { //update
                $scope.seller.status = parseInt($routeParams.status);
                if ($scope.seller.status === 0) {
                    _pageTitle.set('查看Seller');
                } else {
                    _pageTitle.set('编辑Seller');
                }
                $http.get(getSellerUrl + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
						if (json.data.productConfig) {
							angular.forEach(json.data.productConfig, function(v) {
								v.readonly = true;
							});
						}
                        $scope.setAreas(json.data.provinceCode, 'CITYLIST');
                        $scope.setAreas(json.data.cityCode, 'BLOCKLIST');
                        $scope.seller = angular.extend($scope.seller, json.data, {
                            id: $routeParams.id
                        });
                        if ($scope.seller.agreementPhoto === '') {
                            $scope.agreementPhotoUrl = _APP.phImg;
                        } else {
                            $scope.agreementPhotoUrl = $scope.seller.agreementPhoto;
                        }
                        if ($scope.seller.licensePhoto === '') {
                            $scope.licensePhotoUrl = _APP.phImg;
                        } else {
                            $scope.licensePhotoUrl = $scope.seller.licensePhoto;
                        }

                        if ($scope.seller.status === 0) {
                            _pageTitle.set('查看Seller');
                        }
                        setDistrictStr();
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/sellerlist/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建Seller');
				$scope.agreementPhotoUrl = $scope.licensePhotoUrl = null;
                //隐藏loading
                _loading.hide();
            }
			$scope.productId = null;
			$scope.$watch('productId', function(newV) {
				if (!newV) return;
				_loading.show();
				getLocalData('commissiion_p'+newV, getCommissionUrl+'?productId='+newV, 'filteredCommissions', 
					function() {
						_loading.hide();
				}, true);
			});
			$scope.commissionId = null;
			$scope.filteredProducts = [];
			$scope.filteredCommissions = [];
			$scope.seller.productConfig = null;
			$scope.onPreLoadProducts = function() {
				if ($scope.PRODUCTS) {
					_setProducts();
					return;
				}
				_loading.show();
				$q.all([getRemoteData(getProductUrl, 'PRODUCTS')])
					.finally(function() {
						_setProducts();
						_loading.hide();
					});
			};
			var _setProducts = function() {
				$scope.productId = null;
				if (!$scope.seller.productConfig) {
					$scope.filteredProducts = $scope.PRODUCTS;
					return;
				}
				var catalogs = _.map($scope.seller.productConfig, function(p) {
					return p.product.catalog;
				});
				$scope.filteredProducts = _.grep($scope.PRODUCTS, function(p) {
					return catalogs.indexOf(p.catalog) < 0;
				});
			};
			$scope.onRemoveProductConfig = function(config) {
				$scope.seller.productConfig.splice($scope.seller.productConfig.indexOf(config), 1);
				if (!$scope.seller.productConfig.length) $scope.seller.productConfig = null;
			};
			$scope.onAddProductConfig = function() {
				var form = $scope.productConfigForm;
				form.doValidate();
				if (!form.$valid) return;
				if (!$scope.seller.productConfig) $scope.seller.productConfig = [];
				$scope.seller.productConfig.push({
					product: _.find($scope.PRODUCTS, function(p) {
							return p.code == $scope.productId;
						}),
					commission: _.find($scope.filteredCommissions, function(c) {
							return c.code == $scope.commissionId;
						})
				});
				$('#product-commission-config-modal').modal('hide');
			};
            $scope.getSaleTree = function(){
                _jsTree.init(getSaleTreeUrl,function(nodes){
                    var district = [];
                    var districtStr = [];
                    for(var i=0,l=nodes.length;i<l;i++){
                        district.push(nodes[i].original);
                        districtStr.push(nodes[i].original.id);
                    }
                    $scope.seller.district = district;
                    $scope.seller.districtStr = districtStr.join('$');
                    $scope.$apply();
                });
            };
            $scope.removeDistrict = function(id){
                for (var i = $scope.seller.district.length - 1; i >= 0; i--) {
                    if($scope.seller.district[i].id === id){
                        $scope.seller.district.splice(i,1);
                    }
                }
                setDistrictStr();
            };

            //操作districtStr
            function setDistrictStr(){
                var districtStr = [];
                for(var i=0, l=$scope.seller.district.length; i<l; i++){
                    districtStr.push($scope.seller.district[i].id);
                }
                $scope.seller.districtStr = districtStr.join('$');
            }
            $scope.setAreas = function(code, scopekey) {
                if (scopekey === 'CITYLIST') {
                    $scope.CITYLIST = $scope.BLOCKLIST = [];
                } else {
                    $scope[scopekey] = [];
                }
                if (code === undefined || code === '') {
                    return;
                }
                getLocalData('local_' + scopekey + '_' + code, getAreaCityUrl + code, scopekey);
            };
            $scope.chooseImage = function(key) {
                _wxService.chooseOneImage(uploadPhotoUrl, function(photo) {
                    $scope.seller[key] = photo;
                    $scope[key+'Url'] = photo;
                    $scope.$apply();
                });
            };
            $scope.submitForm = function() {
				var form = $scope.d3Form;
				form.doValidate();
				if (!form.$valid) return;
				if (!_.any($scope.seller.productConfig, function(p) {
					return ((p.product.catalog || '').toLowerCase() == standardProductCatalog.toLowerCase());
				})) {
					alert('必须至少选择一个标准产品');
					return;
				}
                _loading.show();
                $http.post(submitSellerUrl, $scope.seller).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/sellerlist/');
                    } else {
                        alert(json.msg);
                    }
                    _loading.hide();
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._SubmitForm + status);
                });
            };
            //获取本地数据
			var cache = {};
            function getLocalData(localkey, geturl, scopekey, finalCallback, isTemp) {
				var defer = $q.defer();
                var localvalue = null;
                if (!isTemp && win.localStorage) {
                    localvalue = win.localStorage.getItem(localkey);
                } else {
					localvalue = cache[localkey];
				}
                if (localvalue !== null && localvalue !== undefined) {
                    $scope[scopekey] = JSON.parse(localvalue);
					defer.resolve();
                } else {
                    $http.get(geturl).success(function(json) {
                        if (!isTemp && !(win.localStorage === undefined || win.localStorage === null)) {
                            win.localStorage.setItem(localkey, JSON.stringify(json.data));
                        } else {
							cache[localkey] = JSON.stringify(json.data);
						}
                        $scope[scopekey] = json.data;
                    }).error(function(data, status, headers, config) {
                        alert('获取数据：' + status);
                    }).finally(function() {
						defer.resolve();
					});
                }
				if (finalCallback) {
					defer.promise.then(function() {
						finalCallback();
					});
				}
				return defer.promise;
            }
            /**
             * 获取远端数据，一般用于字段列表
             * @param  {string} geturl   远端数据请求url
             * @param  {string} scopekey 当前作用域字段，可用$scope[scopekey]访问
             * @return {[type]}          [description]
             */
            function getRemoteData(geturl,scopekey, finalCallback){
                return $http.get(geturl).success(function(json) {
                    if (json.status === 0) {
                        $scope[scopekey] = json.data;
                    } else {
                        alert(json.msg);
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetList+ '[' + scopekey + ']' + status);
                }).finally(function() {
					if (finalCallback) finnalCallback();
				});
            }
        }
    ]);

    Task.controller('S3FormCtrler', ['$scope', '$routeParams', '$http', '$location', '_loading', '_pageTitle', '_wxService', '_APP', '_jsTree',
        function($scope, $routeParams, $http, $location, _loading, _pageTitle, _wxService, _APP, _jsTree) {
            _loading.show();
            //POSTYPES PROVINCELIST CITYLIST BLOCKLIST 是静态存储的资源
            getLocalData('local_PROVINCELIST', 'test/json/BDTask/GetAreas_province.json?code=0', 'PROVINCELIST');
            $scope.s3= angular.extend({}, {
                operate: $routeParams.id === undefined ? 0 : 1,
                sellerId: $routeParams.pid
            });
            $scope.pd = {
                id: $routeParams.pid,
                name: $routeParams.pname
            };

            if ($scope.s3.operate === 1) { //update
                $scope.s3.status = parseInt($routeParams.status);
                if ($scope.s3.status === 0) {
                    _pageTitle.set('查看S3' );
                } else {
                    _pageTitle.set('编辑S3' );
                }
                $http.get('test/json/BDTask/GetS3.json?id=' + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
                        $scope.setAreas(json.data.provinceCode, 'CITYLIST');
                        $scope.setAreas(json.data.cityCode, 'BLOCKLIST');
                        $scope.s3= angular.extend($scope.s3, json.data, {
                            id: $routeParams.id
                        });
                        if ($scope.s3.headPhoto === '') {
                            $scope.headPhotoUrl = _APP.phImg;
                        } else {
                            $scope.headPhotoUrl = $scope.s3.headPhoto;
                        }
                        if ($scope.s3.idPhoto === '') {
                            $scope.idPhotoUrl = _APP.phImg;
                        } else {
                            $scope.idPhotoUrl = $scope.s3.idPhoto;
                        }

                        if ($scope.s3.status === 0) {
                            _pageTitle.set('查看S3');
                        }
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/sellerlist/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建S3');
                $scope.headPhotoUrl = $scope.idPhotoUrl = _APP.phImg;
                //隐藏loading
                _loading.hide();
            }
            $scope.setAreas = function(code, scopekey) {
                if (scopekey === 'CITYLIST') {
                    $scope.CITYLIST = $scope.BLOCKLIST = [];
                } else {
                    $scope[scopekey] = [];
                }
                if (code === undefined || code === '') {
                    return;
                }
                getLocalData('local_' + scopekey + '_' + code, 'test/json/BDTask/GetAreas_city.json?code=' + code, scopekey);
            };
            $scope.chooseImage = function(key) {
                _wxService.chooseOneImage('test/json/BDTask/UploadPhoto.json',function(photo) {
                    $scope.s3[key] = photo;
                    $scope[key+'Url'] = photo;
                    $scope.$apply();
                });
            };
            $scope.submitForm = function() {
				var form = $scope.d3Form;
				form.doValidate();
				if (!form.$valid) return;
                _loading.show();
                $http.post('test/json/BDTask/SubmitS3.json', $scope.s3).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/sellerlist/');
                    } else {
                        alert(json.msg);
                    }
                    _loading.hide();
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._SubmitForm + status);
                });
            };
            //获取本地数据
            function getLocalData(localkey, geturl, scopekey) {
                var localvalue = null;
                if (win.localStorage) {
                    localvalue = win.localStorage.getItem(localkey);
                }
                if (localvalue !== null) {
                    $scope[scopekey] = JSON.parse(localvalue);
                } else {
                    $http.get(geturl).success(function(json) {
                        if (!(win.localStorage === undefined || win.localStorage === null)) {
                            win.localStorage.setItem(localkey, JSON.stringify(json.data));
                        }
                        $scope[scopekey] = json.data;
                    }).error(function(data, status, headers, config) {
                        alert(_APP.err._GetAreas + status);
                    });
                }
            }
        }
    ]);

})(window, document);
