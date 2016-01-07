package com.example.dell.myapplication;

import java.io.Serializable;

/**
 * Created by zhenglong on 2016/1/5.
 */
public class ProgressModel implements Serializable {
    private long _currentBytes;
    private long _contentLength;
    private boolean _done;

    public ProgressModel(long currentBytes, long contentLength, boolean done) {
        _currentBytes = currentBytes;
        _contentLength = contentLength;
        _done = done;
    }

    public long getCurrentBytes() {
        return _currentBytes;
    }

    public void setCurrentBytes(long currentBytes) {
        _currentBytes = currentBytes;
    }

    public long getContentLength() {
        return _contentLength;
    }

    public void setContentLength(long contentLength) {
        _contentLength = contentLength;
    }

    public boolean isDone() {
        return _done;
    }

    public void setDone(boolean done) {
        _done = done;
    }

    @Override
    public String toString() {
        return String.format("ProgressModel{currentBytes=%1$d, contentLength=%2$d, done=%3$b}",
                _currentBytes, _contentLength, _done);
    }
}
