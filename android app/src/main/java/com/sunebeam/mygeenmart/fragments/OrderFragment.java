package com.sunebeam.mygeenmart.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.adapter.OrderAdapter;
import com.sunebeam.mygeenmart.entity.Order;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class OrderFragment extends Fragment {
    RecyclerView recyclerView;
    List<Order> orderList;
    OrderAdapter orderAdapter;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_orders, container, false);

        Toolbar toolbar = view.findViewById(R.id.toolbarOrder);
        AppCompatActivity activity = (AppCompatActivity) getActivity();
        if (activity != null) {
            activity.setSupportActionBar(toolbar);
            activity.getSupportActionBar().setTitle("Order");
        }
        Toast.makeText(activity, "oncreate call order", Toast.LENGTH_SHORT).show();
        return view;

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        recyclerView = view.findViewById(R.id.recyclerView);
        // Add dummy data
        orderList = new ArrayList<>();
        orderList.add(new Order(1, 3, 1, new Timestamp(System.currentTimeMillis()), "Pending", 15.0, 1));

        orderAdapter = new OrderAdapter(requireContext(), orderList);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));//error
        recyclerView.setAdapter(orderAdapter);
        Toast.makeText(getContext(), "order is in onViewCreated", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
        PostNewOrder();
    }
    public void  PostNewOrder(){

    }
}