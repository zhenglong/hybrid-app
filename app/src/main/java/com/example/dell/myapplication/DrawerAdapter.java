package com.example.dell.myapplication;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

class TuiCoolItem {
    String _menuTitle;
    int _menuIcon;

    public String get_menuTitle() {
        return _menuTitle;
    }

    public int get_menuIcon () {
        return _menuIcon;
    }

    public TuiCoolItem(String menuTitle, int menuIcon) {
        _menuIcon = menuIcon;
        _menuTitle = menuTitle;
    }
}

/**
 * Created by zhenglong on 2016/1/11.
 */
public class DrawerAdapter extends BaseAdapter {
    List<TuiCoolItem> _menuItems = new ArrayList<TuiCoolItem>();
    Context _context;

    public DrawerAdapter(Context context) {
        _context = context;
        _menuItems.add(new TuiCoolItem("", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("推荐", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("发现", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("主题", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("站点", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("搜索", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("离线", R.drawable.common_signin_btn_icon_light));
        _menuItems.add(new TuiCoolItem("设置", R.drawable.common_signin_btn_icon_light));
    }

    @Override
    public int getCount() {
        return _menuItems.size();
    }

    @Override
    public TuiCoolItem getItem(int i) {
        return _menuItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if (view == null) {
            view = LayoutInflater.from(_context).inflate(R.layout.menudrawer_item, viewGroup, false);
            ((TextView)view).setText(getItem(i).get_menuTitle());
            ((TextView)view).setCompoundDrawablesWithIntrinsicBounds(getItem(i).get_menuIcon(), 0, 0, 0);
        }
        return view;
    }
}
