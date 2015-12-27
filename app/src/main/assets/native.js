;function Native(ctx) {
  var _context = ctx;

  this.displayImageChooser = function(callbackId) {
    if (_context.loadImageFromGallery) {
      _context.loadImageFromGallery(callbackId);
      return;
    }
    console.log('should be implemented with native');
  };

  this.displayToast = function(str) {
	  _context.showToast(str);
  };
};
