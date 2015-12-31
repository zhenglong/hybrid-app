module.exports = {
    "version": "v0.0.2",
    "paths": {
        "lib": {
            "css": [
                "../FE.lib/bootstrap/3.3.4/css/bootstrap.css",
                "../FE.lib/font-awesome/4.4.0/css/font-awesome.css",
                "../FE.lib/bootstrap/plugins/timepicker/css/bootstrap-timepicker.css",
                "../FE.lib/jquery/plugins/jstree/dist/themes/proton/style.css",
                "src/css/common/app.css"
            ],
            "js": [
                "../FE.lib/jquery/1.11.1/jquery.min.js",
                "../FE.lib/bootstrap/3.3.4/js/bootstrap.js",
                "../FE.lib/bootstrap/plugins/timepicker/js/bootstrap-timepicker.js",
                "../FE.lib/angular/1.3.9/angular.min.js",
                "../FE.lib/angular/1.3.9/angular-route.min.js",
                "../FE.lib/angular/1.3.9/angular-touch.min.js",
                "../FE.lib/angular/1.3.9/angular-sanitize.min.js",
                "../FE.lib/angular/1.3.9/angular-cookies.min.js",
                "../FE.lib/angular/plugins/w5c-validator/w5cValidator.js",
                "../FE.lib/jquery/plugins/jstree/dist/jstree.min.js",
				"../FE.lib/hammer.min.js",
				"../FE.lib/iscroll.js",
                "src/js/common/app.js"
            ],
        },
		"jqMobileCss": [
			"../FE.lib/jquerymobile/jquery.mobile-1.4.0.css",
		],
		"jqMobileJs": [
			"../FE.lib/jquerymobile/jquery.mobile-1.4.0.js",
		],
		"sectionJavascript": [
			"./src/js/common/data.js"
		],
        "release": {
            "dir": "../../build/CatfishFE/Tasks/", //不要忘记最后的斜杠
            "ver": false, //是否要在发布目录下创建版本目录
            "rev": true //是否创建rev文件版本
        },
        "api": {
            "reg": /(?:\.{1,2}\/)*test\/(json|html)\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)_?.*\.\1/g,
            "rep": "/$2/$3"
        },
        "debug": {
        	"baseDir": "../",
        	"proxy": ""
        }
    }
}
