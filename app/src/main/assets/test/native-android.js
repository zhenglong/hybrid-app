//window.Android = {
//  loadImageFromGallery: function() {
//    alert('mock');
//  }
//}
if (!window.Android) alert('Android is :' + Android);
window.bridge = new Bridge(new Native(window.Android), jQuery.ajax);
