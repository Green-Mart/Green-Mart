package com.sunebeam.mygeenmart.adapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.sunebeam.mygeenmart.fragments.CategoryFragment;
import com.sunebeam.mygeenmart.fragments.HomeFragment;
import com.sunebeam.mygeenmart.fragments.OrderFragment;
import com.sunebeam.mygeenmart.fragments.ProfileFragment;

public class MainFragmentAdapter extends FragmentStateAdapter {
    public MainFragmentAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }


    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:return new HomeFragment();//CategoryFragment();
            case 1:return new CategoryFragment();
            case 2:return new OrderFragment(); // Corrected the fragment for position 2
            case 3:return new ProfileFragment();
            default:return new HomeFragment(); // Always return a fragment
        }
    }


    @Override
    public int getItemCount() {
        return 4;
    }
}