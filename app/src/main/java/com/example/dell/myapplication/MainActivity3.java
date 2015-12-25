package com.example.dell.myapplication;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;


public class MainActivity3 extends ActionBarActivity {

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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        try {
            if ((requestCode == JsBind.RESULT_LOAD_IMG) && (resultCode == RESULT_OK) && (null != data)) {
                // Get the image from data
                Uri selectedImage = data.getData();
                //String[] filePathColumn = {MediaStore.Images.Media.DATA};

                // Get the cursor
                //Cursor cursor = getContentResolver().query(selectedImage,
                //        filePathColumn, null, null, null);
                // Move to first row
                //cursor.moveToFirst();

                //int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                //String imgDecodableString = cursor.getString(columnIndex);
                //cursor.close();
                _webView.loadUrl(String.format("javascript:bridge.callback(%0, '%1')", _jsBind.CallbackId, selectedImage.toString()));
            } else {
                Toast.makeText(this, "You haven't picked Image", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Something went wrong", Toast.LENGTH_LONG).show();
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
