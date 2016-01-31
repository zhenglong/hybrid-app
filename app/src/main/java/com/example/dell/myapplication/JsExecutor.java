package com.example.dell.myapplication;

import android.util.Log;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;

/**
 * Created by zhenglong on 1/31/16.
 */
public class JsExecutor {
    private static String LOG_TAG = JsExecutor.class.getName();
    public static double add(double i, double j) {
        Context rhino = Context.enter();
        rhino.setOptimizationLevel(-1);
        double result = 0;
        try {
            Scriptable scope = rhino.initStandardObjects();
            String s = "function add(i, j) { return (i+j); }";
            String funcName = "add";
            rhino.evaluateString(scope, s, "JavaScript", 1, null);
            Object obj = scope.get(funcName, scope);
            if (obj instanceof Function) {
                Function jsFunction = (Function)obj;
                Object jsResult = jsFunction.call(rhino, scope, scope, new Object[] {i, j});
                result = Context.toNumber(jsResult);
            }
        } finally {
            Context.exit();
        }
        Log.d(LOG_TAG, String.format("%f %f %f", i, j, result));
        return result;
    }
}
