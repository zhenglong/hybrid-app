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

    public int CallbackId;

    public JsBind(Activity context) {
        _context = context;
    }

    @JavascriptInterface
    public void loadImageFromGallery(int callbackId) {
        CallbackId = callbackId;
        Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        _context.startActivityForResult(galleryIntent, RESULT_LOAD_IMG);
    }
}
