package com.sunebeam.mygeenmart.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.entity.Product;
import com.sunebeam.mygeenmart.fragments.HomeFragment;
import com.sunebeam.mygeenmart.utils.API;

import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.MyViewHolder> {

    private Context context;
    private List<Product> productList;

    public ProductAdapter(Context context, List<Product> productList) {
        this.context = context;
        this.productList = productList;
    }


    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.list_product, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        Product product = productList.get(position);

        // Load image using Glide
        Glide.with(context)
                .load(API.BASE_URL+"/product/image/" + product.getProductImageUrl()) // Assuming your API serves images at this path
                .placeholder(R.drawable.green_plant) // Optional: show a placeholder image while loading
                .into(holder.imgProduct);
        holder.tvName.setText(product.getProductName());
        holder.tvDescription.setText(product.getProductDescription());
        holder.tvPrice.setText("₹" + product.getProductPrice());

        // On click → show toast with product name
        holder.itemView.setOnClickListener(v -> {
            Toast.makeText(context, "Clicked: " + product.getProductName(), Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    public int getItemCount() {
        return productList.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        ImageView imgProduct;
        TextView tvName, tvDescription, tvPrice;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            imgProduct = itemView.findViewById(R.id.imgProduct);
            tvName = itemView.findViewById(R.id.tvProductName);
            tvDescription = itemView.findViewById(R.id.tvProductDescription);
            tvPrice = itemView.findViewById(R.id.tvProductPrice);
        }
    }
}
