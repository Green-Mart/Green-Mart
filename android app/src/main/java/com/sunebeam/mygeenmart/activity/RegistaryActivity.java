package com.sunebeam.mygeenmart.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.utils.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegistaryActivity extends AppCompatActivity implements View.OnClickListener {

    EditText editTextName, editTextEmail, editTextPassword, editTextPhone;
    Button buttonRegister;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_registary);
        editTextName = findViewById(R.id.editTextName);
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        editTextPhone = findViewById(R.id.editTextPhone);
        buttonRegister = findViewById(R.id.buttonRegister);
        buttonRegister.setOnClickListener(this);
    }


    @Override
    public void onClick(View v) {
        // Validate fields first
        if(editTextName.getText().toString().isEmpty() ||
                editTextEmail.getText().toString().isEmpty() ||
                editTextPassword.getText().toString().isEmpty() ||
                editTextPhone.getText().toString().isEmpty()) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
            return;
        }

        // Create JSON object with correct field names
        JsonObject user = new JsonObject();
        user.addProperty("name", editTextName.getText().toString());
        user.addProperty("email", editTextEmail.getText().toString());
        user.addProperty("passwd", editTextPassword.getText().toString()); // Note: Backend should hash this
        user.addProperty("mobile", editTextPhone.getText().toString());

        RetrofitClient.getInstance().getApi().registerUser(user).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                try {
                    if(response.isSuccessful() && response.body() != null) {
                        String status = response.body().get("status").getAsString();
                        if(status.equals("success")) {
                            Toast.makeText(RegistaryActivity.this, "Registration Successful", Toast.LENGTH_SHORT).show();
                            finish();
                        } else {
                            String message = response.body().get("message").getAsString();
                            Toast.makeText(RegistaryActivity.this, "Failed: " + message, Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(RegistaryActivity.this, "Registration Failed", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Toast.makeText(RegistaryActivity.this, "Error parsing response", Toast.LENGTH_SHORT).show();
                    Log.e("REGISTRATION", "Error: ", e);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Toast.makeText(RegistaryActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("REGISTRATION", "Failure: ", t);
            }
        });
    }
}