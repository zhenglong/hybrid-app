package com.example.dell.myapplication;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;
import android.view.View;

/**
 * Created by zhenglong on 6/11/16.
 */
public class CustomDrawableView extends View {
    private ShapeDrawable _drawable;

    public CustomDrawableView(Context context) {
        super(context);

        int x = 0;
        int y = 0;
        int width = 300;
        int height = 50;

        _drawable = new ShapeDrawable(new OvalShape());
        _drawable.getPaint().setColor(0xff74AC23);
        _drawable.setBounds(x, y, x + width, y + height);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        _drawable.draw(canvas);
    }
}
