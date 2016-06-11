package com.example.dell.myapplication;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.view.View;
import android.view.Window;
import android.view.View.OnClickListener;
import android.widget.Button;

public class EasyTouchActivity extends Activity {

    private int getLayoutResID() {
        return R.layout.activity_main;
    }

    private Button mShowViewButton = null;

    private static final int REQUEST_CODE_ALERT_WINDOW = 1234;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(getLayoutResID());

        initEvent();
    }

    private void initEvent() {
        initViews();

        setViews();
    }

    private void initViews() {
        mShowViewButton = (Button) findViewById(R.id.activity_main_show_touchview_button);
    }

    private void setViews() {
        mShowViewButton.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                if (!requestSystemAlertPermission(EasyTouchActivity.this, null, REQUEST_CODE_ALERT_WINDOW)) {
                    startAuxiliaryService(null);
                }
            }
        });
    }

    public static boolean requestSystemAlertPermission(Activity context, Fragment fragment, int requestCode) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return false;
        }
        final String packageName = context == null ? fragment.getActivity().getPackageName() : context.getPackageName();
        final Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + packageName));
        if (fragment != null)
            fragment.startActivityForResult(intent, requestCode);
        else
            context.startActivityForResult(intent, requestCode);
        return true;
    }

    @TargetApi(Build.VERSION_CODES.M)
    public static boolean isSystemAlertPermissionGranted(Context context) {
        final boolean result = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context);
        return result;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case REQUEST_CODE_ALERT_WINDOW:
                if (isSystemAlertPermissionGranted(EasyTouchActivity.this)) {
                    startAuxiliaryService(null);
                }
                break;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    public void startAuxiliaryService(View v) {
        startService(new Intent(this, AuxiliaryService.class));

        // new TableShowView(this).fun(); 如果只是在activity中启动
        // 当activity跑去后台的时候[暂停态，或者销毁态] 我们设置的显示到桌面的view也会消失
        // 所以这里采用的是启动一个服务，服务中创建我们需要显示到table上的view，并将其注册到windowManager上
        finish();
    }
}