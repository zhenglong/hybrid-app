package com.example.dell.myapplication;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Created by zhenglong on 2016/1/11.
 */
public class ContentFragment extends Fragment {
    public static final String SELECTED_ITEM = "selected_item";

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Bundle bundle = getArguments();
        View view = inflater.inflate(R.layout.fragment_content, null);
        ((TextView)view).setText(bundle.getString(SELECTED_ITEM));
        return view;
    }
}
