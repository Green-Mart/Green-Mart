package com.sunebeam.mygeenmart.activity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.utils.Constants;
import com.sunebeam.mygeenmart.utils.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {

    ImageView logoImage;
    TextView loginTitle;
    EditText editTextEmail, editTextPassword;
    Button buttonLogin, buttonRegister, buttonGoogleLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        logoImage = findViewById(R.id.logoImage);
        loginTitle = findViewById(R.id.loginTitle);
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        buttonLogin = findViewById(R.id.buttonLogin);
        buttonRegister = findViewById(R.id.buttonRegister);
        buttonGoogleLogin = findViewById(R.id.buttonGoogleLogin);
       TextView Or=findViewById(R.id.Or);
        buttonLogin.setOnClickListener(this);
        buttonRegister.setOnClickListener(this::onRegister);
        buttonGoogleLogin.setOnClickListener(this::onGoogleLogin);
        Or.setPaintFlags(Or.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);//for underline the "or " textView
    }

    public void onRegister(View view) {
        startActivity(new Intent(this, RegistaryActivity.class));
    }

    private void saveLoginStatus(boolean isLoggedIn) {
        SharedPreferences preferences = getSharedPreferences(Constants.PREFERENCE_FILE, MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Constants.LOGIN_STATUS, isLoggedIn); // Key: "isLoggedIn", Value: true/false
        editor.commit(); // Save asynchronously
    }
    @Override
    public void onClick(View view) {
        String email = editTextEmail.getText().toString().trim();
        String password = editTextPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Email and password required", Toast.LENGTH_SHORT).show();
            return;
        }

        // Create JSON request body
        JsonObject loginRequest = new JsonObject();
        loginRequest.addProperty("email", email);
        loginRequest.addProperty("passwd", password);


        RetrofitClient.getInstance()
                .getApi()
                .loginUser(loginRequest)
                .enqueue(new Callback<JsonObject>() {
                    @Override
                    public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            JsonObject responseBody = response.body();

                            if (responseBody.get("status").getAsString().equals("success")) {
                                // Login successful

                                Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                                JsonObject object = response.body().get("data").getAsJsonObject();
                                int userId = object.get("userId").getAsInt();
                                SharedPreferences sharedPreferences=getSharedPreferences(Constants.PREFERENCE_FILE,MODE_PRIVATE);
                                SharedPreferences.Editor editor = sharedPreferences.edit();
                                editor.putInt(Constants.USER_ID, userId).commit();
                                Log.e("TAG", "SharedPrefObj: "+object.get("userId"));

                                // Get user role if available
                                String userRole = "customer"; // Default
                                if (responseBody.has("role")) {
                                    userRole = responseBody.get("role").getAsString();
                                }

                                saveLoginStatus(true);
                                // Redirect based on role (if needed)
                                startActivity(new Intent(LoginActivity.this, OtpVerificationActivity.class));
                                finish();
                            } else {
                                // Login failed
                                String message = "Login failed";
                                if (responseBody.has("message")) {
                                    message = responseBody.get("message").getAsString();
                                }
                                Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(LoginActivity.this, "Invalid response from server", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<JsonObject> call, Throwable t) {
                        Toast.makeText(LoginActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        Log.e("LOGIN_ERROR", t.getMessage(), t);
                    }
                });
    }


    public void onGoogleLogin(View view) {
        Toast.makeText(this, "Google Login Clicked", Toast.LENGTH_SHORT).show();
    }
}