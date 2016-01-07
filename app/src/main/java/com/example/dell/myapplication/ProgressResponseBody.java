package com.example.dell.myapplication;

import android.os.RecoverySystem;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.ResponseBody;

import java.io.IOException;

import okio.Buffer;
import okio.BufferedSource;
import okio.ForwardingSource;
import okio.Okio;
import okio.Source;

/**
 * Created by zhenglong on 2016/1/5.
 */
public class ProgressResponseBody extends ResponseBody {
    private final ResponseBody _responseBody;
    private final ProgressListener _progressListener;
    private BufferedSource _bufferedSource;

    public ProgressResponseBody(ResponseBody responseBody, ProgressListener progressListener) {
        _responseBody = responseBody;
        _progressListener = progressListener;
    }

    @Override
    public MediaType contentType() {
        return _responseBody.contentType();
    }

    @Override
    public long contentLength() throws IOException {
        return _responseBody.contentLength();
    }

    @Override
    public BufferedSource source() throws IOException {
        if (_bufferedSource == null) _bufferedSource = Okio.buffer(source(_responseBody.source()));

        return _bufferedSource;
    }

    private Source source(Source source) {
        return new ForwardingSource(source) {
            long totalBytesRead = 0;
            @Override
            public long read(Buffer sink, long byteCount) throws IOException {
                long bytesRead = super.read(sink, byteCount);
                totalBytesRead += bytesRead != -1 ? bytesRead : 0;
                _progressListener.onResponseProgress(totalBytesRead, _responseBody.contentLength(), bytesRead == -1);
                return bytesRead;
            }
        };
    }
}
