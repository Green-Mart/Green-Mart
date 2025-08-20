package com.sunebeam.mygeenmart.activity;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.sunebeam.mygeenmart.R;
import com.sunebeam.mygeenmart.activity.MainActivity;

import java.util.Random;

/**
 * OTP Verification Activity
 *
 * This activity handles:
 * 1. Generating a random 6-digit OTP
 * 2. Displaying the OTP in a notification
 * 3. Verifying user-entered OTP
 * 4. Auto-filling OTP for testing purposes
 * 5. Handling notification permissions
 */
public class OtpVerificationActivity extends AppCompatActivity {

    // Class variables
    private String generatedOtp;
    private EditText otpEditText;
    private Button verifyBtn;

    // Constants
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 1;
    private static final String NOTIFICATION_CHANNEL_ID = "CHANNEL_2";
    private static final String NOTIFICATION_CHANNEL_NAME = "ORDERS";
    private static final int AUTO_FILL_DELAY_MS = 3000; // 3 seconds delay for auto-fill

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp);

        // Initialize UI components
        initializeViews();

        // Generate OTP
        generatedOtp = generateOtp();

        // For testing purposes, show OTP in Toast
        showOtpInToast();

        // Check and request notification permission if needed
        checkNotificationPermission();

        // Set up verification button click listener
        setupVerifyButton();
    }

    /**
     * Initialize all view components
     */
    private void initializeViews() {
        otpEditText = findViewById(R.id.otpEditText);
        verifyBtn = findViewById(R.id.verifyButton);
    }

    /**
     * Display the generated OTP in a Toast (for testing only)
     */
    private void showOtpInToast() {
        Toast.makeText(this, "Your OTP is: " + generatedOtp, Toast.LENGTH_LONG).show();
    }

    /**
     * Set up the verify button click listener
     */
    private void setupVerifyButton() {
        verifyBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                verifyUserOtp();
            }
        });
    }

    /**
     * Verify the user-entered OTP against the generated OTP
     */
    private void verifyUserOtp() {
        String userEnteredOtp = otpEditText.getText().toString().trim();

        if (userEnteredOtp.isEmpty()) {
            showToast("Please enter OTP");
        } else if (userEnteredOtp.equals(generatedOtp)) {
            // Correct OTP - proceed to MainActivity
            startMainActivity();
        } else {
            showToast("Wrong OTP!");
        }
    }

    /**
     * Start MainActivity and finish current activity
     */
    private void startMainActivity() {
        startActivity(new Intent(OtpVerificationActivity.this, MainActivity.class));
        finish();
    }

    /**
     * Check and request notification permission if needed
     */
    private void checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                requestNotificationPermission();
                return;
            }
        }
        // Permission already granted - send notification
        sendOtpNotification();
    }

    /**
     * Request notification permission from user
     */
    private void requestNotificationPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.POST_NOTIFICATIONS},
                NOTIFICATION_PERMISSION_REQUEST_CODE);
    }

    /**
     * Send notification containing the OTP
     */
    private void sendOtpNotification() {
        // Create notification channel (required for Android 8.0+)
        createNotificationChannel();

        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle("Order Placed")
                .setContentText("Your OTP is: " + generatedOtp)
                .setSmallIcon(R.drawable.notification)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        // Check permission again before showing notification
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        // Show the notification with a random ID
        NotificationManagerCompat.from(this).notify(new Random().nextInt(), builder.build());

        // Auto-fill OTP after delay (for testing purposes)
        autoFillOtpAndVerify();
    }

    /**
     * Create notification channel for Android 8.0+
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel(
                    NOTIFICATION_CHANNEL_ID,
                    NOTIFICATION_CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.setDescription("Order notifications");

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(notificationChannel);
        }
    }

    /**
     * Auto-fill OTP and automatically verify (for testing purposes)
     */
    private void autoFillOtpAndVerify() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                otpEditText.setText(generatedOtp); // Auto-fill OTP
                verifyBtn.performClick(); // Automatically click verify button
            }
        }, AUTO_FILL_DELAY_MS);
    }

    /**
     * Handle permission request results
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == NOTIFICATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                sendOtpNotification(); // Permission granted - send notification
            } else {
                showToast("Notification permission denied");
            }
        }
    }

    /**
     * Generate a random 6-digit OTP
     * @return String containing 6-digit OTP
     */
    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    /**
     * Helper method to show Toast messages
     * @param message The message to display
     */
    private void showToast(String message) {
        Toast.makeText(OtpVerificationActivity.this, message, Toast.LENGTH_SHORT).show();
    }
}