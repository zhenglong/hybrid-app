package com.example.dell.myapplication;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

/**
 * Created by zhenglong on 2016/1/6.
 */
public class ProgressNotification {

    private NotificationManager _notifyManager;
    private NotificationCompat.Builder _builder;
    private static final String LOG_TAG = "ProgressNotification";

    public ProgressNotification(Context activity) {
        _notifyManager = (NotificationManager)activity.getSystemService(Context.NOTIFICATION_SERVICE);
        _builder = new NotificationCompat.Builder(activity);
    }

    public Notification create(int notificationId, String title, String content) {
        _builder.setContentTitle(title)
                .setContentText(content)
                .setTicker(content)
                .setSmallIcon(R.drawable.cast_ic_notification_0)
                .setOngoing(true)
                .setAutoCancel(true);
        Notification notification = _builder.build();
        _notifyManager.notify(notificationId, notification);
        Log.d(LOG_TAG, "create progress notification");
        return notification;
    }

    public void update(int notificationId, long total, long progress, String doneMessage) {
        Log.d(LOG_TAG, String.format("%d %d", progress, total));
        if (progress >= total) {
            _builder.setContentText(doneMessage)
                    .setTicker(doneMessage)
                    .setOngoing(false)
                    .setProgress(0, 0, false);
        } else {
            _builder.setProgress((int)total, (int)progress, false);
        }
        _notifyManager.notify(notificationId, _builder.build());
    }
}
