package com.bilhetinho.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import com.bilhetinho.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class BilhetinhoWidgetProvider extends AppWidgetProvider {
    private static final String TAG = "BilhetinhoWidget";
    private static String latestImageUrl = null;
    private static String latestText = null;
    private static final Executor executor = Executors.newSingleThreadExecutor();

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId, latestImageUrl, latestText);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId, String imageUrl, String text) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.bilhetinho_widget);
        
        // Set up the intent that starts the app when widget is clicked
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
        
        // Update the text if available
        if (text != null && !text.isEmpty()) {
            views.setTextViewText(R.id.widget_text, text);
            views.setViewVisibility(R.id.widget_text, View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.widget_text, View.GONE);
        }
        
        // Update the image if URL is available
        if (imageUrl != null && !imageUrl.isEmpty()) {
            executor.execute(() -> {
                try {
                    URL url = new URL(imageUrl);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setDoInput(true);
                    connection.connect();
                    InputStream input = connection.getInputStream();
                    Bitmap bitmap = BitmapFactory.decodeStream(input);
                    
                    if (bitmap != null) {
                        views.setImageViewBitmap(R.id.widget_image, bitmap);
                        views.setViewVisibility(R.id.widget_image, View.VISIBLE);
                        views.setViewVisibility(R.id.widget_empty_state, View.GONE);
                        appWidgetManager.updateAppWidget(appWidgetId, views);
                    } else {
                        showEmptyState(views, appWidgetManager, appWidgetId);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error loading image: " + e.getMessage());
                    showEmptyState(views, appWidgetManager, appWidgetId);
                }
            });
        } else {
            showEmptyState(views, appWidgetManager, appWidgetId);
        }
        
        // Update the widget immediately with whatever we have
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    
    private static void showEmptyState(RemoteViews views, AppWidgetManager appWidgetManager, int appWidgetId) {
        views.setViewVisibility(R.id.widget_image, View.GONE);
        views.setViewVisibility(R.id.widget_empty_state, View.VISIBLE);
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    
    public static void updateWidgetContent(Context context, String imageUrl, String text) {
        latestImageUrl = imageUrl;
        latestText = text;
        
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(new ComponentName(context, BilhetinhoWidgetProvider.class));
        
        // Update all widgets
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId, imageUrl, text);
        }
        
        // Notify that widget data changed
        Intent intent = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
        context.sendBroadcast(intent);
    }
}