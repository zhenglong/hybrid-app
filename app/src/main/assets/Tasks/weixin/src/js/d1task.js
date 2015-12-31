;(function(win, doc, undefined) {
    var Task = angular.module('D1Task', ['ngRoute', 'ngTouch', 'w5c.validator', 'AppModule']);
    Task.run(['_wxService',function(_wxService){
        _wxService.initWXSDK('test/json/D1Task/GetAuth.json');
    }]);
    Task.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/poslist/', {
                templateUrl: 'views/d1task/pos.list.html',
                controller: 'POSListCtrler'
            }).
            when('/pos/', {
                templateUrl: 'views/d1task/pos.form.html',
                controller: 'POSFormCtrler'
            }).
            when('/s1/', {
                templateUrl: 'views/d1task/s1.form.html',
                controller: 'S1FormCtrler'
            }).
            otherwise({
                redirectTo: '/poslist/'
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
            w5cValidatorProvider.setRules({
                salesPerMonth: {
                    pattern: "请输入正整数"
                },
                closingTime: {
                    gt: "结束时间应晚于开始时间"
                }
            });
        }
    ]);
    
    Task.controller('POSListCtrler', ["$scope", "$http", "_loading", "_pageTitle",'_APP',
        function($scope, $http, _loading, _pageTitle,_APP) {
            _pageTitle.set('POS列表');
            _loading.show();
            $http.get('test/json/D1Task/GetPOSList.json').success(function(json) {
                $scope.isDataValidate = json.status === 0 ? true : false;
                if ($scope.isDataValidate) {
                    $scope.postasks = json.data;
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
    Task.controller('POSFormCtrler', ['$scope', '$routeParams', '$http', '$location', '_loading', '_pageTitle', '_wxService','_jsTree','_APP',
        function($scope, $routeParams, $http, $location, _loading, _pageTitle, _wxService, _jsTree,_APP) {
            _loading.show();
            //POSTYPES PROVINCELIST CITYLIST BLOCKLIST 是静态存储的资源
            getLocalData('local_POSTYPES', 'test/json/D1Task/GetPOSTypes.json', 'POSTYPES');
            getLocalData('local_PROVINCELIST', 'test/json/D1Task/GetAreas_province.json?code=0', 'PROVINCELIST');

            getSellers();
            $scope.pos = angular.extend({}, {
                operate: $routeParams.id === undefined ? 0 : 1
            });
            if ($scope.pos.operate === 1) { //update
                $scope.pos.status = parseInt($routeParams.status);
                if ($scope.pos.status === 0) {
                    _pageTitle.set('查看POS');
                } else {
                    _pageTitle.set('编辑POS');
                }
                $http.get('test/json/D1Task/GetPOS.json?id=' + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
                        $scope.setAreas(json.data.provinceCode, 'CITYLIST');
                        $scope.setAreas(json.data.cityCode, 'BLOCKLIST');
                        $scope.pos = angular.extend($scope.pos, json.data, {
                            id: $routeParams.id
                        });
                        if ($scope.pos.photo === '') {
                            $scope.photourl = _APP.phImg;
                        } else {
                            $scope.photourl = $scope.pos.photo;
                        }
                        if ($scope.pos.status === 0) {
                            _pageTitle.set('查看POS');
                        }
                        setDistrictStr();
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/poslist/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建POS');
                $http.get('test/json/D1Task/GetD1Area.json').success(function(json) {
                    if (json.status === 0) {
                        $scope.pos.provinceCode = json.data.provinceCode;
                        $scope.setAreas($scope.pos.provinceCode, 'CITYLIST');
                    } else {
                        alert(json.msg);
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetDefaultArea + status);
                });
                $scope.pos.openningTime = '09:00';
                $scope.pos.closingTime = '21:00';
                $scope.photourl = _APP.phImg;
                //隐藏loading
                _loading.hide();
            }
            APP.initTimePicker();

            $scope.getSaleTree = function(){
                _jsTree.init('test/json/D1Task/GetSaleTree.json',function(nodes){
                    if(nodes.length>1){
                        alert('只能选择一个销售区域');
                        return false;
                    }
                    var district = [];
                    var districtStr = [];
                    for(var i=0,l=nodes.length;i<l;i++){
                        district.push(nodes[i].original);
                        districtStr.push(nodes[i].original.id);
                    }
                    $scope.pos.district = district;
                    $scope.pos.districtStr = districtStr.join('$');
                    $scope.$apply();
                });
            };
            $scope.removeDistrict = function(id){
                for (var i = $scope.pos.district.length - 1; i >= 0; i--) {
                    if($scope.pos.district[i].id === id){
                        $scope.pos.district.splice(i,1);
                    }
                }
                setDistrictStr();
            };
            //操作districtStr
            function setDistrictStr(){
                var districtStr = [];
                for(var i=0, l=$scope.pos.district.length; i<l; i++){
                    districtStr.push($scope.pos.district[i].id);
                }
                $scope.pos.districtStr = districtStr.join('$');
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
                getLocalData('local_' + scopekey + '_' + code, 'test/json/D1Task/GetAreas_city.json?code=' + code, scopekey);
            };
            $scope.chooseImage = function() {
                _wxService.chooseOneImage('test/json/BDTask/UploadPhoto.json',function(photo) {
                    $scope.pos.photo = photo;
                    $scope.photourl = photo;
                    $scope.$apply();
                });
            };
            $scope.submitPosForm = function() {
				var form = $scope.posForm;
				form.doValidate();
				if (!form.$valid) return;
                _loading.show();
                $http.post('test/json/D1Task/SubmitPOS.json', $scope.pos).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/poslist/');
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
            //获取seller列表
            function getSellers(){
                $http.get('test/json/D1Task/GetSellers.json').success(function(json) {
                    if (json.status === 0) {
                        $scope.Sellers = json.data;
                    } else {
                        alert(json.msg);
                    }
                }).error(function(data, status, headers, config) {
                    alert('获取Seller列表出错：' + status);
                });
            }
        }
    ]);

    Task.controller('S1FormCtrler', ['$scope', '$routeParams', '$http', '$location', '_loading', '_pageTitle', '_wxService','_APP',
        function($scope, $routeParams, $http, $location, _loading, _pageTitle, _wxService,_APP) {
            _loading.show();
            $scope.s1 = angular.extend({}, {
                operate: $routeParams.id === undefined ? 0 : 1
            });
            $scope.pd = {
                id: $routeParams.pid,
                name: $routeParams.pname
            };

            if ($scope.s1.operate === 1) { //update
                $scope.s1.status = parseInt($routeParams.status);
                if ($scope.s1.status === 0) {
                    _pageTitle.set('查看S1');
                } else {
                    _pageTitle.set('编辑S1');
                }
                $http.get('test/json/D1Task/GetS1.json?id=' + $routeParams.id).success(function(json) {
                    if (json.status === 0) {
                        $scope.s1 = angular.extend($scope.s1, json.data, {
                            s1Id: $routeParams.id
                        });
                        if ($scope.s1.photo === '') {
                            $scope.photourl = _APP.phImg;
                        } else {
                            $scope.photourl = $scope.s1.photo;
                        }
                        if ($scope.s1.status === 0) {
                            _pageTitle.set('查看S1');
                        }
                        _loading.hide();
                    } else {
                        alert(json.msg);
                        $routeParams = null;
                        $location.path('/poslist/');
                    }
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._GetInfo + status);
                });
            } else { //create
                _pageTitle.set('创建S1');
                $scope.s1.posId = $routeParams.pid;
                $scope.posname = $routeParams.pname;
                $scope.photourl = _APP.phImg;
                _loading.hide();
            }
            $scope.chooseImage = function() {
                _wxService.chooseOneImage('test/json/BDTask/UploadPhoto.json',function(photo) {
                    $scope.s1.photo = photo;
                    $scope.photourl = photo;
                    $scope.$apply();
                });
            };
            $scope.submitS1Form = function() {
				var form = $scope.s1Form;
				form.doValidate();
				if (!form.$valid) return;
                _loading.show();
                $http.post('test/json/D1Task/SubmitS1.json', $scope.s1).success(function(json) {
                    if (json.status === 0) {
                        $routeParams = null;
                        $location.path('/poslist/');
                    } else {
                        alert(json.msg);
                    }
                    _loading.hide();
                }).error(function(data, status, headers, config) {
                    alert(_APP.err._SubmitForm + status);
                });
            };
        }
    ]);

    var APP = {
        initTimePicker: function() {
            var timepicker_opts = {
                minuteStep: 1,
                template: 'modal',
                appendWidgetTo: '.main',
                showSeconds: false,
                showMeridian: false,
                defaultTime: true
            };
            $('.timepicker-start').timepicker(timepicker_opts);
            $('.timepicker-end').timepicker(timepicker_opts);
        }
    };
})(window, document);
