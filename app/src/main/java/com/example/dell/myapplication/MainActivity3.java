package com.example.dell.myapplication;

import android.Manifest.permission;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;

public class MainActivity3 extends AppCompatActivity {

    private WebView _webView;
    private  JsBind _jsBind;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main_activity3);
        _webView = new WebView(this);
        WebSettings settings = _webView.getSettings();
        settings.setJavaScriptEnabled(true);
        _jsBind = new JsBind(this);
        _webView.addJavascriptInterface(_jsBind, "Android");
        _webView.loadUrl("file:///android_asset/index.html");
        _webView.setWebChromeClient(new WebChromeClient());
        setContentView(_webView);
    }

    private Intent _imageData;
    private void readImage(Intent data) {
        String funcName = "readImage";
        try {
            // Get the image from data
            Uri selectedImage = data.getData();
            String[] filePathColumn = {MediaStore.Images.Media.DATA};

            // Get the cursor
            Cursor cursor = getContentResolver().query(selectedImage,
                    filePathColumn, null, null, null);
            // Move to first row
            cursor.moveToFirst();

            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String decodedImageString = cursor.getString(columnIndex);
            cursor.close();
            Log.d(funcName, decodedImageString);
            String imgBase64String;
            FileInputStream stream = new FileInputStream(decodedImageString);
            _webView.loadUrl(String.format("javascript:bridge.callback(%1d, '%2s')",
                    _jsBind.CallbackId, decodedImageString));
        }catch (Exception e) {
            Log.d(funcName, e.getMessage(), e);
            Toast.makeText(this, "Something went wrong", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        String funcName = "onActivityResult";
        super.onActivityResult(requestCode, resultCode, data);
        if ((requestCode == JsBind.RESULT_LOAD_IMG) && (resultCode == RESULT_OK) && (null != data)) {
            if (ContextCompat.checkSelfPermission(this, permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(this, permission.READ_EXTERNAL_STORAGE)) {
                    _imageData = data;
                    // handled by callback onRequestPermissionResult
                } else {
                    ActivityCompat.requestPermissions(this,
                            new String[]{
                                    permission.READ_EXTERNAL_STORAGE
                            }, requestCode);
                    readImage(data);
                }
            } else {
                readImage(data);
            }
        } else {
            Toast.makeText(this, "You haven't picked Image", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch(requestCode) {
            case JsBind.RESULT_LOAD_IMG:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    readImage(_imageData);
                }
                break;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && _webView.canGoBack()) {
            Log.d("onKeyDown", "go back");
            _webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
