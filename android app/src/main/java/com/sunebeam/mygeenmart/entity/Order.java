package com.sunebeam.mygeenmart.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Order implements Serializable {
    private int orderId;
    private int userId;
    private int shippingAddressId;
    private Timestamp orderDate;
    private String orderStatus;
    private double totalOrderAmount;
    private int deliveryPartnerId=4;
    private List<OrderItem> items = new ArrayList<>();
    private int image;

    // Constructors
    public Order() {}

    public Order(int orderId, int userId, int shippingAddressId, Timestamp orderDate,
                 String orderStatus, double totalOrderAmount, int deliveryPartnerId) {
        this.orderId = orderId;
        this.userId = userId;
        this.shippingAddressId = shippingAddressId;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalOrderAmount = totalOrderAmount;
        this.deliveryPartnerId = deliveryPartnerId;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getShippingAddressId() { return shippingAddressId; }
    public void setShippingAddressId(int shippingAddressId) { this.shippingAddressId = shippingAddressId; }

    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public double getTotalOrderAmount() { return totalOrderAmount; }
    public void setTotalOrderAmount(double totalOrderAmount) { this.totalOrderAmount = totalOrderAmount; }

    public int getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(int deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public int getImage() {
        return image;
    }
}