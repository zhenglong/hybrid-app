package com.example.dell.myapplication.test;

import com.example.dell.myapplication.MyHttp;

import junit.framework.TestCase;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by dell on 2016/1/4.
 */
public class MyHttpTest extends TestCase {

    @Test
    public void testGet() throws Exception {
        MyHttp client = new MyHttp();
        String url = "http://172.16.10.116:3333/upload/";
        String fileName = "";
        client.fileUpload(url, fileName);
    }
}