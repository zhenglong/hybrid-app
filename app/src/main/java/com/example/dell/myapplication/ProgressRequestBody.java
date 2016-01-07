package com.example.dell.myapplication;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.internal.Util;

import java.io.File;
import java.io.IOException;

import okio.Buffer;
import okio.BufferedSink;
import okio.BufferedSource;
import okio.ForwardingSink;
import okio.Okio;
import okio.Sink;
import okio.Source;

/**
 * Created by zhenglong on 2016/1/5.
 */

public class ProgressRequestBody extends RequestBody {
    private final RequestBody _requestBody;
    private final ProgressListener _listener;
    private BufferedSink _bufferedSink;

    public ProgressRequestBody(RequestBody requestBody, ProgressListener listener) {
        _requestBody = requestBody;
        _listener = listener;
    }

    @Override
    public long contentLength() throws IOException {
        return _requestBody.contentLength();
    }

    @Override
    public MediaType contentType() {
        return _requestBody.contentType();
    }

    @Override
    public void writeTo(BufferedSink sink) throws IOException {
        if (_bufferedSink == null) {
            _bufferedSink = Okio.buffer(sink(sink));
        }
        _requestBody.writeTo(_bufferedSink);
        _bufferedSink.flush();
    }

    private Sink sink(Sink sink) {
        return new ForwardingSink(sink) {
            long bytesWritten = 0;
            long contentLength = 0;
            @Override
            public void write(Buffer source, long byteCount) throws IOException {
                super.write(source, byteCount);
                if (contentLength == 0) {
                    contentLength = contentLength();
                }
                bytesWritten += byteCount;
                _listener.onRequestProgress(bytesWritten, contentLength, bytesWritten == contentLength);
            }
        };
    }
}