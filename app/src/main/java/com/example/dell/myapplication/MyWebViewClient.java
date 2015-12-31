package com.example.dell.myapplication;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.GeolocationPermissions;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by zhenglong on 2015/12/24.
 */
class MyWebViewClient extends WebViewClient {
    private String logName = "shouldOverrideUrlLoading";

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        Intent intent = new Intent(view.getContext(), MainActivity3.class);
        intent.putExtra("url", url);
        view.getContext().startActivity(intent);
        return true;
    }
}
