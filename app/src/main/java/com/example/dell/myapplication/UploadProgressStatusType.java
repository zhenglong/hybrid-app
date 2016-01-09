package com.example.dell.myapplication;

/**
 * Created by zhenglong on 2016/1/9.
 */
public enum UploadProgressStatusType {
    ongoing(0x01), failed(0x02), successful(0x04), cancelled(0x08);

    private int _value;
    UploadProgressStatusType(int v) {
        _value = v;
    }
    public int getValue() {
        return _value;
    }
}
