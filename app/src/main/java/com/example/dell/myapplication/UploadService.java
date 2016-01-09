package com.example.dell.myapplication;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;

/**
 * Created by zhenglong on 2016/1/6.
 */
public class UploadService extends Service {
    private static final String LOG_TAG = UploadService.class.getName();
    private static final int UPLOAD_SERVICE_ID = 101;
    private ProgressNotification _progressNotification;
    private static final int PROGRESS_NOTIFICATION_ID=102;
    private static final String UPLOAD_URL = "http://172.16.10.116:3333/upload/";

    private Binder _binder = new UploadBinder();
    private MyHttp _http;

    public static final String UPLOAD_STATUS_CHANGE = "uploadStatusChange";
    public static final String DATA_FIELD_STATUS = "status";
    public static final String DATA_FIELD_DATA = "data";
    public static final String DATA_FIELD_MESSAGE = "message";
    public static final String DATA_FIELD_FILE_PATH = "filePath";


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

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String filePath = intent.getStringExtra(DATA_FIELD_FILE_PATH);
        upload(filePath);
        return START_STICKY;
    }

    private void broadcastLocal(UploadProgressStatusType status, ProgressModel model, String message) {
        Intent intent = new Intent(UPLOAD_STATUS_CHANGE);
        intent.putExtra(DATA_FIELD_STATUS, status);
        switch (status) {
            case ongoing:
                intent.putExtra(DATA_FIELD_DATA, model);
                break;
            case failed:
            case successful:
                intent.putExtra(DATA_FIELD_MESSAGE, message);
        }
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    private void upload(final String filePath) {
        Log.d(LOG_TAG, "upload:" + filePath);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    _progressNotification = new ProgressNotification(UploadService.this);
                    _progressNotification.create(PROGRESS_NOTIFICATION_ID, Consts.uploadFileNotificationTitle,
                            Consts.uploadFileNotificationContent);
                    // do something in background
                    final ProgressListener progressListener = new ProgressListener() {
                        @Override
                        public void onResponseProgress(long bytesRead, long contentLength, boolean done) {
                            // nothing to do
                        }

                        @Override
                        public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
                            _progressNotification.update(PROGRESS_NOTIFICATION_ID, contentLength, bytesWritten, Consts.uploadFileComplete);
                            if (contentLength == bytesWritten) {
                                broadcastLocal(UploadProgressStatusType.successful, null, Consts.uploadFileComplete);
                                stopSelf();
                                Log.d(LOG_TAG, "stop service by itself");
                            }
                        }
                    };
                    _http.registerEvents(progressListener);
                    _http.fileUpload(UPLOAD_URL, filePath);
                } catch (IOException e) {
                    Log.d(LOG_TAG, Consts.uploadFileFailed, e);
                    _progressNotification.update(PROGRESS_NOTIFICATION_ID, 0, 0, Consts.uploadFileFailed);
                    broadcastLocal(UploadProgressStatusType.failed, null, Consts.uploadFileFailed);
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
