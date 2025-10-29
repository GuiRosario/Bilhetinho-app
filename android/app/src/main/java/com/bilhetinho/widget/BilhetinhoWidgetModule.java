package com.bilhetinho.widget;

import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BilhetinhoWidgetModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public BilhetinhoWidgetModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BilhetinhoWidgetModule";
    }

    @ReactMethod
    public void updateWidget(String imageUrl, String text, Promise promise) {
        try {
            Context context = reactContext.getApplicationContext();
            BilhetinhoWidgetProvider.updateWidgetContent(context, imageUrl, text);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("UPDATE_WIDGET_ERROR", e.getMessage(), e);
        }
    }
}