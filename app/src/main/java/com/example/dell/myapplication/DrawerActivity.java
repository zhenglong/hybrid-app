package com.example.dell.myapplication;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Debug;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

/**
 * Created by zhenglong on 2016/1/11.
 */
public class DrawerActivity extends AppCompatActivity {
    ListView _menuDrawer;
    DrawerAdapter _menuDrawerAdapter;
    DrawerLayout _drawerLayout;
    String _currentContentTitle;
    ActionBarDrawerToggle _drawerToggle;
    private static final String LOG_TAG = DrawerActivity.class.getName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.drawlayout_test);

        _currentContentTitle = getResources().getString(R.string.global_title);
        _menuDrawer = (ListView)findViewById(R.id.left_drawer);
        _menuDrawerAdapter = new DrawerAdapter(this);
        _menuDrawer.setAdapter(_menuDrawerAdapter);
        _menuDrawer.setOnItemClickListener(new DrawerItemClickListener());

        _drawerLayout = (DrawerLayout)findViewById(R.id.drawer_layout);
        _drawerToggle = new DrawerMenuToggle(this, _drawerLayout, R.string.drawer_open, R.string.drawer_close);
        _drawerLayout.setDrawerListener(_drawerToggle);

        ActionBar actionBar =getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setHomeButtonEnabled(true);
        //actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setTitle(_currentContentTitle);
        actionBar.setIcon(R.drawable.common_signin_btn_icon_light);
        JsExecutor.add(100, 200);
        Debug.startMethodTracing("jniTest");
        Debug.stopMethodTracing();

    }

    private class DrawerItemClickListener implements ListView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            selectItem(i);
        }

        public void selectItem(int position) {
            Bundle bundle = new Bundle();
            bundle.putString(ContentFragment.SELECTED_ITEM, _menuDrawerAdapter.getItem(position).get_menuTitle());

            Fragment contentFragment = new ContentFragment();
            contentFragment.setArguments(bundle);

            FragmentManager fragmentManager = getFragmentManager();
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.replace(R.id.content_frame, contentFragment).commit();

            _menuDrawer.setItemChecked(position, true);
            setTitle(_menuDrawerAdapter.getItem(position).get_menuTitle());
            _drawerLayout.closeDrawer(_menuDrawer);
            Log.d(LOG_TAG, "on select item in drawer list view");
        }

        public void setTitle(String title) {
            _currentContentTitle = title;
            getSupportActionBar().setTitle(title);
        }
    }

    private class DrawerMenuToggle extends ActionBarDrawerToggle {
        public DrawerMenuToggle(Activity activity, DrawerLayout drawerLayout,
                                int openDrawerContentDescRes,
                                int closeDrawerContentDescRes) {
            super(activity, drawerLayout, openDrawerContentDescRes, closeDrawerContentDescRes);
        }

        @Override
        public void onDrawerClosed(View drawerView) {
            super.onDrawerClosed(drawerView);
            getSupportActionBar().setTitle(_currentContentTitle);
            invalidateOptionsMenu();
            Log.d(LOG_TAG, "drawer close");
        }

        @Override
        public void onDrawerOpened(View drawerView) {
            super.onDrawerOpened(drawerView);
            getSupportActionBar().setTitle(R.string.global_title);
            invalidateOptionsMenu();
            Log.d(LOG_TAG, "drawer opened");
        }
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        _drawerToggle.syncState();
        Log.d(LOG_TAG, "post create");
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        _drawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (_drawerToggle.onOptionsItemSelected(item)) {
            return true;
        }
        if (id == R.id.action_settings) {
            return true;
        }
        if (id == R.id.action_websearch) {
            Toast.makeText(this, "webSearch menu is clicked", Toast.LENGTH_SHORT).show();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        boolean drawerOpen = _drawerLayout.isDrawerOpen(_menuDrawer);
        Log.d(LOG_TAG, "on prepareOptionsMenu:" + drawerOpen);
        menu.findItem(R.id.action_websearch).setVisible(!drawerOpen);
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public void onBackPressed() {
        boolean drawerState = _drawerLayout.isDrawerOpen(_menuDrawer);
        if (drawerState) {
            _drawerLayout.closeDrawers();
            return;
        }
        super.onBackPressed();
    }
}