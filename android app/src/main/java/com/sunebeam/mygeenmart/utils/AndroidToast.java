package com.sunebeam.mygeenmart.utils;

import android.content.Context;
import android.widget.Toast;

public class AndroidToast {
    public static void showToast(Context context,String message){
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }
}
