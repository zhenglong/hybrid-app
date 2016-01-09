package com.example.dell.myapplication;

import android.content.Intent;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by zhenglong on 2015/12/24.
 */
class MyWebViewClient extends WebViewClient {
    private String logName = "shouldOverrideUrlLoading";

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        Intent intent = new Intent(view.getContext(), WebViewLauncher.class);
        intent.putExtra("url", url);
        view.getContext().startActivity(intent);
        return true;
    }
}
