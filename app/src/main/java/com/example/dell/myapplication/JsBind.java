package com.example.dell.myapplication;

import android.app.Activity;
import android.app.DialogFragment;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.util.SparseIntArray;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by zhenglong on 2015/12/24.
 */
class JsBind {

    public final static int RESULT_LOAD_IMG = 1;
    private final Activity _context;
    public SparseIntArray callbacks = new SparseIntArray();

    public static final int LOAD_IMAGE_KEY = 1;
    public static final int SHOW_DATE_PICKER_KEY = 2;
    public static final String LOG_TAG = JsBind.class.getName();
    private DialogFragment _datePicker;

    public JsBind(Activity context) {
        _context = context;
    }

    @JavascriptInterface
    public void loadImageFromGallery(int callbackId) {
        callbacks.put(LOAD_IMAGE_KEY, callbackId);
        Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        galleryIntent.setType("image/*");
        _context.startActivityForResult(galleryIntent, RESULT_LOAD_IMG);
    }

    @JavascriptInterface
    public void showDatePicker(String title, long initDate, int callbackId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) return;
        if (_datePicker == null) {
            _datePicker = new DatePickerFragment();
        }
        Log.d(LOG_TAG, String.format("showDatePicker: %s %d %d", title, initDate, callbackId));
        Bundle bundle = new Bundle();
        bundle.putLong("initDate", initDate);
        _datePicker.setArguments(bundle);
        callbacks.put(SHOW_DATE_PICKER_KEY, callbackId);
        _datePicker.show(_context.getFragmentManager(), title);
    }

    @JavascriptInterface
    public void setTitle(String title) {

    }

    @JavascriptInterface
    public void showToast(String str) {
        Toast.makeText(_context, str, Toast.LENGTH_LONG).show();
    }
}
