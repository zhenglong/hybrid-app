var app = angular.module('GetQrCodeApp', []);
app.controller('GetQrCodeCtrler', ['$location', function($location) {
	$('#qrcode').qrcode($location.search().link);
}]);
