package com.sunebeam.mygeenmart.activity;

import android.os.Bundle;

import androidx.appcompat.widget.Toolbar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.adapter.MainFragmentAdapter;


public class MainActivity extends AppCompatActivity {
    ViewPager2 viewPager2;
    TabLayout tabLayout;
    MainFragmentAdapter mainFragmentAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        viewPager2 = findViewById(R.id.viewPager2);
        tabLayout = findViewById(R.id.tabLayout);


        // Fix: Use getSupportFragmentManager() for fragment handling
        mainFragmentAdapter = new MainFragmentAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager2.setAdapter(mainFragmentAdapter);

        // Fix: Use lambda for cleaner code
        new TabLayoutMediator(tabLayout, viewPager2, (tab, position) -> {
            switch (position) {
                case 0: tab.setIcon(R.drawable.ic_home); break;
                case 1: tab.setIcon(R.drawable.ic_order); break;
                case 2: tab.setIcon(R.drawable.ic_category); break;
                case 3: tab.setIcon(R.drawable.ic_profile); break;
            }
            // In MainActivity.java after attaching the mediator
            tabLayout.setTabIconTint(ContextCompat.getColorStateList(this, R.color.blue));
        }).attach();


        // Fix: Set initial fragment to Home
        viewPager2.setCurrentItem(0, false);
    }
}