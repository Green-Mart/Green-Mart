package com.sunebeam.mygeenmart.activity;


import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;


import androidx.appcompat.app.AppCompatActivity;


import com.sunebeam.mygeenmart.R;

public class OrderActivity extends AppCompatActivity {

    int ProductId;
    TextView productNameText, productPriceText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order);
        Toast.makeText(this, "intent reach", Toast.LENGTH_SHORT).show();
        int productId = getIntent().getIntExtra("product_id1", -1);

        if (productId != -1) {
            // Use this productId to fetch product details or show directly
            Toast.makeText(this, "Product ID: " + productId, Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "No product ID passed!", Toast.LENGTH_SHORT).show();
            finish(); // Optional: finish the activity if no valid ID
        }
        Toast.makeText(this, "Category: " + ProductId, Toast.LENGTH_SHORT).show();
        PostProductInOrder();
        productNameText = findViewById(R.id.productNameText);
        productPriceText = findViewById(R.id.productPriceText);
    }

    private void PostProductInOrder() {

    }
}