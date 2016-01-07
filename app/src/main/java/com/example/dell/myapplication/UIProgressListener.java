package com.example.dell.myapplication;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import java.lang.ref.WeakReference;

import javax.net.ssl.HandshakeCompletedListener;

/**
 * Created by zhenglong on 2016/1/5.
 */
public abstract class UIProgressListener implements ProgressListener {
    private static final int REQUEST_UPDATE = 0x01;
    private static final int RESPONSE_UPDATE = 0x02;

    private static class UIHandler extends Handler {
        private final WeakReference<UIProgressListener> _uiProgressListenerWeakReference;
        public UIHandler(Looper looper, UIProgressListener uiProgressListener) {
            super();
            _uiProgressListenerWeakReference = new WeakReference<UIProgressListener>(uiProgressListener);
        }

        @Override
        public void handleMessage(Message message) {
            switch (message.what) {
                case REQUEST_UPDATE:
                    UIProgressListener uiProgressListener = _uiProgressListenerWeakReference.get();
                    if (uiProgressListener != null) {
                        ProgressModel progressModel = (ProgressModel)message.obj;
                        uiProgressListener.onUIRequestProgress(progressModel.getCurrentBytes(), progressModel.getContentLength(), progressModel.isDone());
                    }
                    break;
                case RESPONSE_UPDATE:
                    UIProgressListener uiProgressListener1 = _uiProgressListenerWeakReference.get();
                    if (uiProgressListener1 != null) {
                        ProgressModel progressModel = (ProgressModel)message.obj;
                        uiProgressListener1.onUIResponseProgress(progressModel.getCurrentBytes(), progressModel.getContentLength(), progressModel.isDone());
                    }
                default:
                    super.handleMessage(message);
                    break;
            }
        }
    }
    private final Handler _handler = new UIHandler(Looper.getMainLooper(), this);

    @Override
    public void onRequestProgress(long bytesWritten, long contentLength, boolean done) {
        Message message = Message.obtain();
        message.obj = new ProgressModel(bytesWritten, contentLength, done);
        message.what = REQUEST_UPDATE;
        _handler.sendMessage(message);
    }

    @Override
    public void onResponseProgress(long bytesRead, long contentLength, boolean done) {
        Message message = Message.obtain();
        message.obj = new ProgressModel(bytesRead, contentLength, done);
        message.what = RESPONSE_UPDATE;
        _handler.sendMessage(message);
    }

    public abstract void onUIRequestProgress(long bytesWrite, long contentLength, boolean done);

    public abstract void onUIResponseProgress(long bytesRead, long contentLength, boolean done);
}
