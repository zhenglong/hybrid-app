function Native(ctx) {
  var _context = ctx;

  this.displayImageChooser = function() {
    alert(3);
    if (_context.loadImageFromGallery) {
      alert('3_1');
      _context.loadImageFromGallery();
      return;
    }
    alert(4);
    console.log('should be implemented with native');
  };
};
