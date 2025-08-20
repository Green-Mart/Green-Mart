package com.sunebeam.mygeenmart.entity;

import java.io.Serializable;

public class CartRequest implements Serializable {
    private int userId;
    private int productId;
    private int cartItemQuantity;

    public CartRequest() {
    }

    public CartRequest(int userId, int productId, int cartItemQuantity) {
        this.userId = userId;
        this.productId = productId;
        this.cartItemQuantity = cartItemQuantity;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getCartItemQuantity() {
        return cartItemQuantity;
    }

    public void setCartItemQuantity(int cartItemQuantity) {
        this.cartItemQuantity = cartItemQuantity;
    }

    @Override
    public String toString() {
        return "CartRequest [userId=" + userId + ", productId=" + productId + ", cartItemQuantity=" + cartItemQuantity
                + "]";
    }

}
