package com.example.dell.myapplication;

import android.app.Activity;
import android.app.DialogFragment;
import android.content.Intent;
import android.provider.MediaStore;
import android.support.v4.app.FragmentActivity;
import android.util.SparseIntArray;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;

/**
 * Created by zhenglong on 2015/12/24.
 */
class JsBind {

    public final static int RESULT_LOAD_IMG = 1;
    private final Activity _context;
    private SparseIntArray _callbacks = new SparseIntArray();

    private static final int LOAD_IMAGE_KEY = 1;
    private static final int SHOW_DATE_PICKER_KEY = 2;

    public JsBind(Activity context) {
        _context = context;
    }

    @JavascriptInterface
    public void loadImageFromGallery(int callbackId) {
        _callbacks.put(LOAD_IMAGE_KEY, callbackId);
        Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        galleryIntent.setType("image/*");
        _context.startActivityForResult(galleryIntent, RESULT_LOAD_IMG);
    }

    @JavascriptInterface
    public void showDatePicker(String title, long initDate, int callbackId) {
        DialogFragment newFragment = new DatePickerFragment();
        newFragment.dismiss();
        _callbacks.put(SHOW_DATE_PICKER_KEY, callbackId);
        newFragment.show(_context.getFragmentManager(), title);
    }

    @JavascriptInterface
    public void setTitle(String title) {

    }

    @JavascriptInterface
    public void showToast(String str) {
        Toast.makeText(_context, str, Toast.LENGTH_LONG).show();
    }
}
