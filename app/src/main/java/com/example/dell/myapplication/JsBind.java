package com.example.dell.myapplication;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by dell on 2015/12/24.
 */
public class JsBind {

    public static int RESULT_LOAD_IMG = 1;
    private Activity _context;

    public JsBind(Activity context) {
        _context = context;
    }

    public void loadImageFromGallery() {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        _context.startActivityForResult(galleryIntent, RESULT_LOAD_IMG);
    }

    @JavascriptInterface
    public void displayToast(String txt) {
        Toast.makeText(_context, txt, Toast.LENGTH_LONG).show();
    }
}
