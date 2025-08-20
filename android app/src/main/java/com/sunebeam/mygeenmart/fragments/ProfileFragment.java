package com.sunebeam.mygeenmart.fragments;

import static android.content.Context.MODE_PRIVATE;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Toolbar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.MenuProvider;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Lifecycle;

import com.google.gson.JsonObject;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.activity.LoginActivity;
import com.sunebeam.mygeenmart.utils.AndroidToast;
import com.sunebeam.mygeenmart.utils.Constants;
import com.sunebeam.mygeenmart.utils.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {
    TextView textName, textEmail, textPassword, textPhone;
    Toolbar toolbarProfile;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        textName = view.findViewById(R.id.textName);
        textEmail = view.findViewById(R.id.textEmail);
        textPassword = view.findViewById(R.id.textPassword);
        textPhone = view.findViewById(R.id.textPhone);
        //for setting the logout and manage event
        logoutIcon();
    }

    public void logoutIcon() {
        //if i do it set to right this is latest one
        //add menuProvider to host activity toolbar
        requireActivity().addMenuProvider(new MenuProvider() {
            @Override
            public void onCreateMenu(@org.jspecify.annotations.NonNull Menu menu, @org.jspecify.annotations.NonNull MenuInflater menuInflater) {
                menuInflater.inflate(R.menu.bottom_nav_menu, menu);
            }

            //find the menu item and set its click listener
            @Override
            public boolean onMenuItemSelected(@org.jspecify.annotations.NonNull MenuItem menuItem) {
                if (menuItem.getItemId() == R.id.logout) {
                    menuItem.setOnMenuItemClickListener(item -> {
                        //handle click here
                        getContext().getSharedPreferences(Constants.PREFERENCE_FILE, MODE_PRIVATE).edit().putBoolean(Constants.LOGIN_STATUS, false).apply();
                    startActivity(new Intent(getContext(), LoginActivity.class));
                    getActivity().finish();
                    return true;
                    });
                }

                return false;
            }
        }, getViewLifecycleOwner(), Lifecycle.State.RESUMED);

    }

    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
        getUserById();
    }

    private void getUserById() {
        int userId = requireContext().getSharedPreferences(Constants.PREFERENCE_FILE, MODE_PRIVATE).getInt(Constants.USER_ID, -1);
        Toast.makeText(getContext(), "this is id"+userId, Toast.LENGTH_SHORT).show();
        Log.e("TAG", "this is userId: "+ userId);
        RetrofitClient.getInstance().getApi().getUserById(userId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                Log.e("TAG", "onResponse: " + response.toString());
                if (response.isSuccessful() && response != null) {
                    JsonObject jsonObject = response.body().get("data").getAsJsonObject();
                    textName.setText("Name: " + jsonObject.get("userName").getAsString());
                    textEmail.setText("Email: " + jsonObject.get("userEmail").getAsString());
                    textPassword.setText("Password: " + jsonObject.get("userPassword").getAsString());
                    textPhone.setText("Phone: " + jsonObject.get("userPhone").getAsString());
                    Log.e("TAG", "onResponse: "+jsonObject.toString());
                } else {
                    AndroidToast.showToast(getContext(), "check response wrong getId");
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                AndroidToast.showToast(getContext(), "faill responce getId");
            }
        });
        //AndroidToast.showToast(getContext(),"Profile get call");

    }

}