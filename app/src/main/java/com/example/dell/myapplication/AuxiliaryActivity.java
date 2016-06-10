package com.example.dell.myapplication;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.view.Window;

/**
 * Created by zhenglong on 6/10/16.
 */
public class AuxiliaryActivity extends Activity {
    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        lockScreen();
    }

    private void lockScreen() {
//        DevicePolicyManager devicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
//        ComponentName componentName = new ComponentName(this, AuxiliaryActivity.class);
//        if (devicePolicyManager.isAdminActive(componentName)) {
//            devicePolicyManager.lockNow();
//            finish();
//        } else {
//            activeManager(componentName);
//        }
    }

    private void activeManager(ComponentName componentName) {
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "One key lock the screen");
        startActivity(intent);
        finish();
    }
}
