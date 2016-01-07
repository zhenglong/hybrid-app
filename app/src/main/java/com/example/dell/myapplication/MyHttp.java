package com.example.dell.myapplication;

import android.os.RecoverySystem;
import android.util.Log;

import com.squareup.okhttp.Headers;
import com.squareup.okhttp.Interceptor;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.internal.Util;

import java.io.File;
import java.io.IOException;

import okio.BufferedSink;
import okio.Okio;
import okio.Source;

/**
 * Created by zhenglong on 12/28/15.
 */
public class MyHttp {
    private OkHttpClient _client;
    private static final MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");

    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    private ProgressListener _progressListener;

    public MyHttp() {
        _client = new OkHttpClient();
    }

    public void registerEvents(final ProgressListener progressListener) {
        _progressListener = progressListener;
//        _client.networkInterceptors().add(new Interceptor() {
//            @Override
//            public Response intercept(Chain chain) throws IOException {
//                Response originalResponse = chain.proceed(chain.request());
//                return originalResponse.newBuilder()
//                        .body(new ProgressResponseBody(originalResponse.body(), progressListener))
//                        .build();
//            }
//        });
    }
    public String get(String url) throws IOException {
        Request request = new Request.Builder()
                .url(url).build();
        Response response = _client.newCall(request).execute();
        return response.body().toString();
    }

    public String fileUpload(String url, String fileName) throws IOException {
        RequestBody requestBody = new MultipartBuilder()
                .type(MultipartBuilder.FORM)
                .addPart(
                        Headers.of("Content-Disposition", "form-data; name=\"image\"; filename=\"image\""),
                        RequestBody.create(MEDIA_TYPE_PNG, new File(fileName)))
                .build();
        Request request = new Request.Builder()
                .url(url)
                .post(new ProgressRequestBody(requestBody, _progressListener))
                .build();
        Response response = _client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
        return response.body().string();
    }

    public String post(String url, String json) throws IOException {
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        Response response = _client.newCall(request).execute();
        return response.body().string();
    }
}

