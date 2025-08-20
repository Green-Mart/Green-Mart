package com.sunebeam.mygeenmart.fragments;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.adapter.ProductAdapter;

import com.sunebeam.mygeenmart.entity.Product;

import com.sunebeam.mygeenmart.utils.AndroidToast;

import java.util.ArrayList;
import java.util.List;



public class HomeFragment extends Fragment {
    private static final String TAG = "HomeFragment";

    private RecyclerView recyclerView;
    private List<Product> productList;
    private  ProgressBar progressBar;
    private ProductAdapter productAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        Toolbar toolbar = view.findViewById(R.id.toolbarHome);
        AppCompatActivity activity = (AppCompatActivity) getActivity();
        if (activity != null) {
            activity.setSupportActionBar(toolbar);
            activity.getSupportActionBar().setTitle("Home");
        }
        return view;

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Initialize views
        recyclerView = view.findViewById(R.id.recylerView);
//        progressBar = view.findViewById(R.id.progressBar); // Add this to your layout

        // Setup RecyclerView
        setupRecyclerView();

        getAllProduct(); // Moved this call here


    }

    private void setupRecyclerView() {
        productList = new ArrayList<>();
        productAdapter = new ProductAdapter(getContext(), productList);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setHasFixedSize(true);
        recyclerView.setAdapter(productAdapter);

    }

    private void showLoading(boolean isLoading) {
        if (progressBar != null) {
            progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        }
    }

    private void getAllProduct() {
        AndroidToast.showToast(requireContext(), "Fetching products in HomeFragments...");
//        showLoading(true);
//
//        RetrofitClient.getInstance()
//            .getApi()
//            .getAllProducts()
//            .enqueue(new Callback<ApiResponse<List<Product>>>() {
//                @Override
//                public void onResponse(Call<ApiResponse<List<Product>>> call,
//                                     Response<ApiResponse<List<Product>>> response) {
//                    if (response.isSuccessful() && response.body() != null) {
//                        productList.clear();
//                        productList.addAll(response.body().getData());
//                        productAdapter.notifyDataSetChanged();
//                    } else {
//                        AndroidToast.showToast(requireContext(), "Failed to load products");
//                    }
//                    showLoading(false);
//                }
//
//                @Override
//                public void onFailure(Call<ApiResponse<List<Product>>> call, Throwable t) {
//                    AndroidToast.showToast(requireContext(), "Error: " + t.getMessage());
//                    Log.e(TAG, "onFailure: ",t );
//                    showLoading(false);
//                }
//            });
    }

    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
        Log.d(TAG, "onViewStateRestored: Fragment state restored");
//        getAllProduct(); // Removed this call from here
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}