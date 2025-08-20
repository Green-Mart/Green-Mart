plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.sunebeam.mygeenmart"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sunebeam.mygeenmart"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {

    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.navigation.fragment)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
    // Retrofit for networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0") // ✅ Use 2.9.0 instead of 3.0.0 (no such version)
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // Glide for image loading
    implementation("com.github.bumptech.glide:glide:4.16.0")

    // Core libraries
    implementation("androidx.core:core:1.16.0")
    implementation("androidx.core:core-ktx:1.16.0")

    // UI + Navigation libraries via version catalogs
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)

    // RecyclerView (use stable latest version)
    implementation("androidx.recyclerview:recyclerview:1.3.2")


    // Test dependencies
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}