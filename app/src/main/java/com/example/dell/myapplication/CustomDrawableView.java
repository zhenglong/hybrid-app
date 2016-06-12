package com.example.dell.myapplication;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Created by zhenglong on 6/11/16.
 */
public class CustomDrawableView extends View {
    private ShapeDrawable _drawable;

    public CustomDrawableView(Context context) {
        super(context);

        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Point size = new Point();
        windowManager.getDefaultDisplay().getSize(size);
        int width = 300;
        int height = 50;
        int x = (size.x - width) / 2;
        int y = (size.y - height) / 2;

        _drawable = new ShapeDrawable(new OvalShape());
        _drawable.getPaint().setColor(0xff74AC23);
        _drawable.setBounds(x, y, x + width, y + height);

//        this.setBackgroundColor(Color.BLACK);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        _drawable.draw(canvas);
    }
}
