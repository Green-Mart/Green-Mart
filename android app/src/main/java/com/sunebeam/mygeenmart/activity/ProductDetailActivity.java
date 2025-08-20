// ProductDetailActivity.java
package com.sunebeam.mygeenmart.activity;

import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.adapter.ProductAdapter;
import com.sunebeam.mygeenmart.entity.Product;
import com.sunebeam.mygeenmart.utils.RetrofitClient;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProductDetailActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    ProductAdapter adapter;
    List<Product> productList = new ArrayList<>();
    List<Product> cartList = new ArrayList<>();
    String categoryName;
    private static final String TAG = "ProductDetailActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_detail_activity);

        categoryName = getIntent().getStringExtra("categoryName");

        recyclerView = findViewById(R.id.recyclerView);
        RecyclerLayoutSpaceCode();

        adapter = new ProductAdapter(this, productList);
        GridLayoutManager layoutManager = new GridLayoutManager(this, 1);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(adapter);

        getProductByCategory(categoryName);
    }

    private void RecyclerLayoutSpaceCode() {
        recyclerView.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(@NonNull Rect outRect, @NonNull View view,
                                       @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
                outRect.bottom = 20;
            }
        });
    }

    private void getProductByCategory(String categoryNames) {
        RetrofitClient.getInstance().getApi().getProductByCategory(categoryNames)
                .enqueue(new Callback<JsonObject>() {
                    @Override
                    public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                        JsonArray jsonArray = response.body().getAsJsonArray("data");
                        productList.clear();
                        for (JsonElement element : jsonArray) {
                            JsonObject obj = element.getAsJsonObject();
                            Product product = new Product();
                            product.setProductId(obj.get("productId").getAsInt());
                            product.setProductName(obj.get("productName").getAsString());
                            product.setProductPrice(obj.get("productPrice").getAsDouble());
                            product.setProductQuantity(0); // init to 0
                            product.setProductDescription(obj.get("productDescription").getAsString());
                            product.setProductImageUrl(obj.get("productImageUrl").getAsString());
                            productList.add(product);
                        }
                        adapter.notifyDataSetChanged();
                    }

                    @Override
                    public void onFailure(Call<JsonObject> call, Throwable t) {
                        Toast.makeText(ProductDetailActivity.this, "Failed", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_product_detail, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.menu_cart) {
            if (cartList.isEmpty()) {
                Toast.makeText(this, "Cart is empty", Toast.LENGTH_SHORT).show();
            } else {
                Intent intent = new Intent(this, CartActivity.class);
                intent.putExtra("cartList", (Serializable) cartList);
                startActivity(intent);
            }
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
