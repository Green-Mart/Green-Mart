package com.sunebeam.mygeenmart.utils;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String error;

    // Getters and setters
    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public String getError() { return error; }
}