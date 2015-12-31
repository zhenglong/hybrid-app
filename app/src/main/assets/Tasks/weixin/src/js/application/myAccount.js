var app  = anuglar.module('MyAccountApp', []);
app.controller('MyAccountCtrler', function() {
	if ($(".ui-block-b.withdraw-block").html() === undefined) {
		$(".ui-block-a.account-block").removeClass("ui-block-a");
	}
});
