package com.sunebeam.mygeenmart.utils;

import com.google.gson.JsonObject;
import com.sunebeam.mygeenmart.entity.Order;


import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface API {
    String BASE_URL="http://192.168.0.106:4000";
    @POST("/users/signup")
    Call<JsonObject> registerUser(@Body JsonObject user);
    @POST("/users/signin") // Your login endpoint
    Call<JsonObject> loginUser(@Body JsonObject loginRequest);

    @GET("orders/with-items")
    Call<ApiResponse<List<Order>>> getOrdersWithItems();

    @GET("/users/{userId}")
    Call<JsonObject> getUserById(@Path("userId") int userId);

    @GET("/product/customer/bycategory/{categoryName}")
    Call<JsonObject> getProductByCategory(@Path("categoryName") String categoryName);

    @POST("/orders/")
    Call<JsonObject> PostNewOrder();

    @POST("/cartitem/insert")
    Call<JsonObject> insertCart(@Body JsonObject cartObj);

    @PUT("cartiteam/{cartItemId}")
    Call<JsonObject> updateCart(@Path("cartItemId") int cartItemId, @Body JsonObject body);

}

