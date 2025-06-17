create database green_mart_project;

use green_mart_project;


CREATE TABLE Users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) UNIQUE NOT NULL, -- Renamed for clarity
    userPassword VARCHAR(255) NOT NULL,    -- Renamed for clarity
    userPhone VARCHAR(20),                  -- Renamed for clarity
    userRole ENUM('customer', 'shopkeeper', 'admin', 'partner') DEFAULT 'customer', -- Renamed for clarity
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


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


CREATE TABLE Categories (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(100) NOT NULL, 
    categoryDescription TEXT            
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Products (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    categoryId INT NOT NULL,
    productName VARCHAR(100) NOT NULL, 
    productDescription TEXT,           
    productPrice DECIMAL(10,2) NOT NULL,
    productQuantity INT NOT NULL,      
    productImageUrl VARCHAR(255),      
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Categories(categoryId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Orders (
    orderId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    shippingAddressId INT,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orderStatus ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    totalOrderAmount DECIMAL(10,2) NOT NULL, 
    deliveryPartnerId INT,
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (shippingAddressId) REFERENCES Addresses(addressId)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (deliveryPartnerId) REFERENCES Users(userId) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE OrderItems (
    orderItemId INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    itemQuantity INT NOT NULL,        
    priceAtOrder DECIMAL(10,2) NOT NULL,
    itemStatus ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending', 
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE CartItems (
    userId INT NOT NULL,
    productId INT NOT NULL,
    cartItemQuantity INT NOT NULL, 
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Payments (
    transactionId VARCHAR(100) PRIMARY KEY,
    orderId INT NOT NULL,
    paymentAmount DECIMAL(10,2) NOT NULL, 
    paymentMethod ENUM('card', 'upi', 'wallet', 'cod') NOT NULL, 
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Reviews (
    userId INT NOT NULL,
    productId INT NOT NULL,
    productRating INT CHECK (productRating BETWEEN 1 AND 5), 
    reviewComment TEXT,                                      
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE WishLists (
    wishListId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    wishListComment TEXT, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(productId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
