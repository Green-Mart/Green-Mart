create database green_mart_project;

use green_mart_project;

-- 1. Users Table
CREATE TABLE Users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) UNIQUE NOT NULL, -- Renamed for clarity
    userPassword VARCHAR(255) NOT NULL,    -- Renamed for clarity
    userPhone VARCHAR(20),                  -- Renamed for clarity
    userRole ENUM('customer', 'shopkeeper', 'admin', 'partner') DEFAULT 'customer', -- Renamed for clarity
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 2. Addresses Table
CREATE TABLE Addresses (
    addressId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    streetAddress TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postalCode VARCHAR(20),
    country VARCHAR(100),
    addressType ENUM('pickup', 'drop', 'shipping') DEFAULT 'shipping',
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 3. Categories Table
CREATE TABLE Categories (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(100) NOT NULL, -- Renamed for clarity
    categoryDescription TEXT            -- Renamed for clarity
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 4. Products Table
CREATE TABLE Products (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    categoryId INT NOT NULL,
    productName VARCHAR(100) NOT NULL, -- Renamed for clarity
    productDescription TEXT,           -- Renamed for clarity
    productPrice DECIMAL(10,2) NOT NULL,
    productQuantity INT NOT NULL,      -- Renamed for clarity
    productImageUrl VARCHAR(255),      -- Renamed for clarity
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Categories(categoryId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 5. Orders Table
CREATE TABLE Orders (
    orderId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    shippingAddressId INT,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orderStatus ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending', -- Renamed for clarity
    totalOrderAmount DECIMAL(10,2) NOT NULL, -- Renamed for clarity
    deliveryPartnerId INT,
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (shippingAddressId) REFERENCES Addresses(addressId)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (deliveryPartnerId) REFERENCES Users(userId) -- Assuming delivery partners are also users
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 6. Order Items Table
CREATE TABLE OrderItems (
    orderItemId INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    itemQuantity INT NOT NULL,        -- Renamed for clarity
    priceAtOrder DECIMAL(10,2) NOT NULL,
    itemStatus ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending', -- Renamed for clarity
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 7. Cart Items Table
CREATE TABLE CartItems (
    userId INT NOT NULL,
    productId INT NOT NULL,
    cartItemQuantity INT NOT NULL, -- Renamed for clarity
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 8. Payments Table
CREATE TABLE Payments (
    transactionId VARCHAR(100) PRIMARY KEY,
    orderId INT NOT NULL,
    paymentAmount DECIMAL(10,2) NOT NULL, -- Renamed for clarity
    paymentMethod ENUM('card', 'upi', 'wallet', 'cod') NOT NULL, -- Renamed for clarity
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending', -- Renamed for clarity
    paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 9. Reviews Table
CREATE TABLE Reviews (
    userId INT NOT NULL,
    productId INT NOT NULL,
    productRating INT CHECK (productRating BETWEEN 1 AND 5), -- Renamed for clarity
    reviewComment TEXT,                                      -- Renamed for clarity
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- 10. Wish Lists Table
CREATE TABLE WishLists (
    wishListId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    wishListComment TEXT, -- Renamed for clarity
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
