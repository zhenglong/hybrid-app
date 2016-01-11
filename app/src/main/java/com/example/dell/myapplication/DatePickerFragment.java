package com.example.dell.myapplication;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.DatePicker;

import java.util.Calendar;
import java.util.Date;

/**
 * Created by zhenglong on 2016/1/9.
 */
public class DatePickerFragment extends DialogFragment
    implements DatePickerDialog.OnDateSetListener {
    private static final String LOG_TAG = DatePickerFragment.class.getName();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d(LOG_TAG, "on create");
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onDestroy() {
        Log.d(LOG_TAG, "on destroy");
        super.onDestroy();
    }

    @Override
    public void onDestroyView() {
        Log.d(LOG_TAG, "on destroy view");
        super.onDestroyView();
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.d(LOG_TAG, "on create view");
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Log.d(LOG_TAG, "on create dialog");
        final Calendar c = Calendar.getInstance();
        Bundle bundle = getArguments();
        if (bundle != null) {
            long initDate = bundle.getLong("initDate");
            c.setTimeInMillis(initDate);
        }
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);
        return new DatePickerDialog(getActivity(), this, year, month, day);
    }

    @Override
    public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
        Log.d(LOG_TAG, String.format("%d %d %d", i, i1, i2));
    }
}
