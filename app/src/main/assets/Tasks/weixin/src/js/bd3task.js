;(function(win, doc, undefined) {
    var Task = angular.module('BD3Task', ['ngRoute', 'ngTouch', 'w5c.validator', 'AppModule']);
    Task.run(['_wxService',function(_wxService){
        _wxService.initWXSDK('test/json/BDTask/GetAuth.json');
    }]);
    Task.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/d3list/', {
                templateUrl: 'views/bdtask/d3.list.html',
                controller: 'D3ListCtrler'
            }).
            when('/d3/', {
                templateUrl: 'views/bdtask/d3.form.html',
                controller: 'D3FormCtrler'
            }).
            when('/d2list/', {
                templateUrl: 'views/bdtask/d2.list.4bd3.html',
                controller: 'D2ListCtrler'
            }).
            when('/d2/', {
                templateUrl: 'views/bdtask/dx.form.html',
                controller: 'DxFormCtrler'
            }).
            when('/d1/', {
                templateUrl: 'views/bdtask/dx.form.html',
                controller: 'DxFormCtrler'
            }).
            otherwise({
                redirectTo: '/d3list/'
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
    
    Task.controller('D3ListCtrler', ["$scope", "$http", "_loading", "_pageTitle", "_APP",
        function($scope, $http, _loading, _pageTitle, _APP) {
            _pageTitle.set('D3列表');
            _loading.show();
            $http.get('test/json/BDTask/GetDxList_3.json').success(function(json) {
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
    Task.controller('D2ListCtrler', ["$scope", '$routeParams', "$http", "_loading", "_pageTitle", "_APP",
        function($scope,$routeParams,$http, _loading, _pageTitle, _APP) {
            $scope.d2 = {
                id : $routeParams.d2id,
                name: $routeParams.d2name,
                status: parseInt($routeParams.d2status)
            };
            $scope.d3 = {
                name: $routeParams.d3name
            };
            _pageTitle.set('D2及其下属D1');
            _loading.show();

            $http.get('test/json/BDTask/GetDxList_2.json?id='+$routeParams.d2id).success(function(json) {
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
    Task.controller('D3FormCtrler', ['$scope', '$routeParams', '$http', '$location', '_loading', '_pageTitle', '_wxService', '_APP', '_jsTree',
        function($scope, $routeParams, $http, $location, _loading, _pageTitle, _wxService, _APP, _jsTree) {
            _loading.show();
            //POSTYPES PROVINCELIST CITYLIST BLOCKLIST 是静态存储的资源
            getLocalData('local_PROVINCELIST', 'test/json/BDTask/GetAreas_province.json?code=0', 'PROVINCELIST');
            $scope.d3 = angular.extend({}, {
                operate: $routeParams.id === undefined ? 0 : 1
            });
            if ($scope.d3.operate === 1) { //update
                $scope.d3.status = parseInt($routeParams.status);
                if ($scope.d3.status === 0) {
                    _pageTitle.set('查看D3');
                } else {
                    _pageTitle.set('编辑D3');
                }
                $http.get('test/json/BDTask/GetD3.json?id=' + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
                        $scope.setAreas(json.data.provinceCode, 'CITYLIST');
                        $scope.setAreas(json.data.cityCode, 'BLOCKLIST');
                        $scope.d3 = angular.extend($scope.d3, json.data, {
                            id: $routeParams.id
                        });
                        if ($scope.d3.headPhoto === '') {
                            $scope.headPhotoUrl = _APP.phImg;
                        } else {
                            $scope.headPhotoUrl = $scope.d3.headPhoto;
                        }
                        if ($scope.d3.idPhoto === '') {
                            $scope.idPhotoUrl = _APP.phImg;
                        } else {
                            $scope.idPhotoUrl = $scope.d3.idPhoto;
                        }
                        if ($scope.d3.status === 0) {
                            _pageTitle.set('查看D3');
                        }
                        setDistrictStr();
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/d3list/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建D3');
                $scope.headPhotoUrl = $scope.idPhotoUrl = _APP.phImg;
                //隐藏loading
                _loading.hide();
            }
            $scope.getSaleTree = function(){
                _jsTree.init('test/json/BDTask/GetSaleTree.json',function(nodes){
                    var district = [];
                    var districtStr = [];
                    for(var i=0,l=nodes.length;i<l;i++){
                        district.push(nodes[i].original);
                        districtStr.push(nodes[i].original.id);
                    }
                    $scope.d3.district = district;
                    $scope.d3.districtStr = districtStr.join('$');
                    $scope.$apply();
                });
            };
            $scope.removeDistrict = function(id){
                for (var i = $scope.d3.district.length - 1; i >= 0; i--) {
                    if($scope.d3.district[i].id === id){
                        $scope.d3.district.splice(i,1);
                    }
                }
                setDistrictStr();
            };
            
            //操作districtStr
            function setDistrictStr(){
                var districtStr = [];
                for(var i=0, l=$scope.d3.district.length; i<l; i++){
                    districtStr.push($scope.d3.district[i].id);
                }
                $scope.d3.districtStr = districtStr.join('$');
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
                    $scope.d3[key] = photo;
                    $scope[key+'Url'] = photo;
                    $scope.$apply();
                });
            };
            $scope.submitForm = function() {
				var form = $scope.d3Form;
				form.doValidate();
				if (!form.$valid) return;
                _loading.show();
                $http.post('test/json/BDTask/SubmitD3.json', $scope.d3).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/d3list/');
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

    Task.controller('DxFormCtrler', ['$scope', '$routeParams', '$http', '$location', '_loading', '_pageTitle', '_wxService', '_APP', '_jsTree',
        function($scope, $routeParams, $http, $location, _loading, _pageTitle, _wxService, _APP, _jsTree) {
            _loading.show();
            //POSTYPES PROVINCELIST CITYLIST BLOCKLIST 是静态存储的资源
            getLocalData('local_PROVINCELIST', 'test/json/BDTask/GetAreas_province.json?code=0', 'PROVINCELIST');
            $scope.dx = angular.extend({}, {
                operate: $routeParams.id === undefined ? 0 : 1,
                parentId: $routeParams.pid
            });
            $scope.pd = {
                id: $routeParams.pid,
                name: $routeParams.pname
            };
            $scope.role = $location.path().replace(/\//g,'').toUpperCase();

            if ($scope.dx.operate === 1) { //update
                $scope.dx.status = parseInt($routeParams.status);
                if ($scope.dx.status === 0) {
                    _pageTitle.set('查看'+$scope.role );
                } else {
                    _pageTitle.set('编辑'+$scope.role );
                }
                $http.get('test/json/BDTask/GetDx_2.json?id=' + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
                        $scope.setAreas(json.data.provinceCode, 'CITYLIST');
                        $scope.setAreas(json.data.cityCode, 'BLOCKLIST');
                        $scope.dx = angular.extend($scope.dx, json.data, {
                            id: $routeParams.id
                        });
                        if ($scope.dx.headPhoto === '') {
                            $scope.headPhotoUrl = _APP.phImg;
                        } else {
                            $scope.headPhotoUrl = $scope.dx.headPhoto;
                        }
                        if ($scope.dx.idPhoto === '') {
                            $scope.idPhotoUrl = _APP.phImg;
                        } else {
                            $scope.idPhotoUrl = $scope.dx.idPhoto;
                        }
                        
                        $scope.dx.status=0;

                        setDistrictStr();
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/d3list/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建'+$scope.role );
                $scope.headPhotoUrl = $scope.idPhotoUrl = _APP.phImg;
                //隐藏loading
                _loading.hide();
            }
            $scope.getSaleTree = function(){
                _jsTree.init('test/json/BDTask/GetSaleTree.json',function(nodes){
                    var district = [];
                    var districtStr = [];
                    for(var i=0,l=nodes.length;i<l;i++){
                        district.push(nodes[i].original);
                        districtStr.push(nodes[i].original.id);
                    }
                    $scope.dx.district = district;
                    $scope.dx.districtStr = districtStr.join('$');
                    $scope.$apply();
                });
            };
            $scope.removeDistrict = function(id){
                for (var i = $scope.dx.district.length - 1; i >= 0; i--) {
                    if($scope.dx.district[i].id === id){
                        $scope.dx.district.splice(i,1);
                    }
                }
                setDistrictStr();
            };
            
            //操作districtStr
            function setDistrictStr(){
                var districtStr = [];
                for(var i=0, l=$scope.dx.district.length; i<l; i++){
                    districtStr.push($scope.dx.district[i].id);
                }
                $scope.dx.districtStr = districtStr.join('$');
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
                    $scope.dx[key] = photo;
                    $scope[key+'Url'] = photo;
                    $scope.$apply();
                });
            };
            $scope.submitForm = function() {
				var form = $scope.d3Form;
				form.doValidate();
				if (!form.$valid) return;
                _loading.show();
                $scope.dx.role = $scope.role;
                $http.post('test/json/BDTask/SubmitDx.json', $scope.dx).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/d3list/');
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
