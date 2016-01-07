package com.example.dell.myapplication;

/**
 * Created by zhenglong on 2016/1/5.
 */
public interface ProgressListener {
    void onResponseProgress(long bytesRead, long contentLength, boolean done);
    void onRequestProgress(long bytesWritten, long contentLength, boolean done);
}
