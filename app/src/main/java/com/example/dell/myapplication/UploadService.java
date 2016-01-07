package com.example.dell.myapplication;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import java.io.IOException;

/**
 * Created by zhenglong on 2016/1/6.
 */
public class UploadService extends Service {
    private static final String LOG_TAG = "UploadService";
    private static final int UPLOAD_SERVICE_ID = 101;
    private ProgressNotification _progressNotification;
    private static final String UPLOAD_URL = "http://172.16.10.116:3333/upload/";

    private Binder _binder = new UploadBinder();
    private MyHttp _http;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return _binder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(LOG_TAG, "onCreate");
        _http = new MyHttp();
    }

    public void upload(final String filePath) {
        Log.d(LOG_TAG, "upload:" + filePath);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    _progressNotification = new ProgressNotification(UploadService.this);
                    Notification notification = _progressNotification.create(UPLOAD_SERVICE_ID, Consts.uploadFileNotificationTitle,
                            Consts.uploadFileNotificationContent);
                    startForeground(UPLOAD_SERVICE_ID, notification);
                    // do something in background
                    final ProgressListener progressListener = new ProgressListener() {
                        @Override
                        public void onResponseProgress(long bytesRead, long contentLength, boolean done) {
                            // nothing to do
                        }

                        @Override
                        public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                            _progressNotification.update(UPLOAD_SERVICE_ID, contentLength, bytesWritten, Consts.uploadFileComplete);
                        }
                    };
                    _http.registerEvents(progressListener);
                    _http.fileUpload(UPLOAD_URL, filePath);
                } catch (IOException e) {
                    Log.d(LOG_TAG, "failed to upload file", e);
                }
            }
        }).start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // TODO:revoke the resources
    }

    class UploadBinder extends Binder {
        public UploadService getService() {
            return UploadService.this;
        }
    }
}
