    create database green_mart;

    use green_mart;

    -- Drop tables if they exist in the correct order to avoid foreign key issues
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS return_items; -- Potential improvement suggested below
    DROP TABLE IF EXISTS returns;
    DROP TABLE IF EXISTS payments;
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS addresses;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS shopkeepers;
    DROP TABLE IF EXISTS admins;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS suppliers;

    -- -----------------------------------------------------
    -- Table `suppliers`
    -- Represents the entities providing products to the store.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `suppliers` (
        `supplier_id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL, -- Email should be unique for login/contact
        `password_hash` VARCHAR(255) NOT NULL, -- Store hashed passwords, never plain text
        `phone` VARCHAR(50),
        `company_details` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp of last update
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Information about product suppliers.';

    -- -----------------------------------------------------
    -- Table `customers`
    -- Represents the end-users who place orders.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `customers` (
        `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL, -- Email should be unique for login
        `password_hash` VARCHAR(255) NOT NULL, -- Store hashed passwords
        `phone` VARCHAR(50),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Information about customers.';

    -- -----------------------------------------------------
    -- Table `admins`
    -- Represents administrative users of the system.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `admins` (
        `admin_id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(100) UNIQUE NOT NULL, -- Unique username for login
        `password_hash` VARCHAR(255) NOT NULL, -- Store hashed passwords
        `email` VARCHAR(255) UNIQUE NOT NULL, -- Email should be unique
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Information about system administrators.';

    -- -----------------------------------------------------
    -- Table `shopkeepers`
    -- Represents users managing shop/store operations (e.g., processing returns).
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `shopkeepers` (
        `shopkeeper_id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL, -- Email should be unique for login
        `password_hash` VARCHAR(255) NOT NULL, -- Store hashed passwords
        `phone` VARCHAR(50),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Information about shopkeepers.';

    -- -----------------------------------------------------
    -- Table `categories`
    -- Represents product categories.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `categories` (
        `category_id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(150) UNIQUE NOT NULL, -- Category names should be unique
        `description` TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Product categories.';

    -- -----------------------------------------------------
    -- Table `addresses`
    -- Stores multiple addresses for each customer (Shipping, Billing, etc.).
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `addresses` (
        `address_id` INT AUTO_INCREMENT PRIMARY KEY,
        `customer_id` INT NOT NULL,
        `street` VARCHAR(255) NOT NULL,
        `city` VARCHAR(100) NOT NULL,
        `state` VARCHAR(100),
        `postal_code` VARCHAR(20) NOT NULL,
        `country` VARCHAR(100) NOT NULL,
        `type` VARCHAR(50) DEFAULT 'Shipping', -- e.g., 'Shipping', 'Billing'
        FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE -- If customer is deleted, their addresses are also deleted
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Customer addresses.';

    -- -----------------------------------------------------
    -- Table `products`
    -- Information about the products sold.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `products` (
        `product_id` INT AUTO_INCREMENT PRIMARY KEY,
        `supplier_id` INT, -- Can be NULL if not directly tied to a specific supplier in this system
        `category_id` INT, -- Can be NULL if not categorized
        `sku` VARCHAR(100) UNIQUE NOT NULL, -- Stock Keeping Unit, unique identifier
        `name` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `price` DECIMAL(10, 2) NOT NULL CHECK (`price` >= 0), -- Product price per unit
        `stock_quantity` INT NOT NULL DEFAULT 0 CHECK (`stock_quantity` >= 0), -- Current stock level
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE, -- If a supplier is deleted, set supplier_id to NULL
        FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE SET NULL ON UPDATE CASCADE -- If a category is deleted, set category_id to NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Information about products.';

    -- -----------------------------------------------------
    -- Table `orders`
    -- Represents customer orders.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `orders` (
        `order_id` INT AUTO_INCREMENT PRIMARY KEY,
        `customer_id` INT NOT NULL,
        `shipping_address_id` INT NOT NULL,
        -- Improvement: Add billing_address_id as it's often different
        -- `billing_address_id` INT NULL,
        `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date and time the order was placed
        `status` VARCHAR(50) NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
        `total_amount` DECIMAL(12, 2) NOT NULL CHECK (`total_amount` >= 0), -- Total amount including tax/shipping if applicable
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE, -- Prevent deleting customer if they have orders
        FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses`(`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE -- Prevent deleting address if it's used in an order
        -- FOREIGN KEY (`billing_address_id`) REFERENCES `addresses`(`address_id`) ON DELETE SET NULL ON UPDATE CASCADE -- If billing address is deleted, set to NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Customer orders.';

    -- -----------------------------------------------------
    -- Table `order_items`
    -- Represents the individual items within an order (Many-to-Many relationship between Orders and Products).
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `order_items` (
        `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_id` INT NOT NULL,
        `product_id` INT NOT NULL,
        `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0), -- Number of units of the product in this item
        `price_at_order` DECIMAL(10, 2) NOT NULL CHECK (`price_at_order` >= 0), -- Price of the product at the time of order
        `item_status` VARCHAR(50), -- e.g., 'Fulfilled', 'Backordered', 'Returned'
        FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE, -- If an order is deleted, its items are deleted
        FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE -- Prevent deleting product if it's in an order item
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Items included in each order.';

    -- -----------------------------------------------------
    -- Table `payments`
    -- Records payment transactions for orders.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `payments` (
        `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_id` INT NOT NULL,
        `amount` DECIMAL(12, 2) NOT NULL CHECK (`amount` >= 0), -- Amount paid in this transaction
        `payment_method` VARCHAR(50) NOT NULL, -- e.g., 'Credit Card', 'PayPal', 'Bank Transfer'
        `status` VARCHAR(50) NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Completed', 'Failed', 'Refunded'
        `transaction_id` VARCHAR(255) UNIQUE, -- Unique ID from payment gateway (if applicable)
        `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of payment
        FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE -- If order is deleted, payment records are deleted
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Payment transactions for orders.';

    -- -----------------------------------------------------
    -- Table `returns`
    -- Records customer return requests.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `returns` (
        `return_id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_id` INT NOT NULL, -- The order associated with the return
        `customer_id` INT NOT NULL, -- The customer initiating the return (diagram showed nullable, but tying to order/customer is essential)
        `request_date` DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date the return was requested
        `reason` TEXT, -- Reason for the return
        `status` VARCHAR(50) NOT NULL DEFAULT 'Requested', -- e.g., 'Requested', 'Approved', 'Rejected', 'Completed', 'Refunded'
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE, -- Prevent deleting order if there's a return request
        FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE -- Prevent deleting customer if they have return requests
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Customer return requests.';

    -- -----------------------------------------------------
    -- Table `cart_items`
    -- Represents items currently in a customer's shopping cart.
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `cart_items` (
        `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
        `customer_id` INT NOT NULL,
        `product_id` INT NOT NULL,
        `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0), -- Number of items in the cart
        `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the item was added to the cart
        UNIQUE KEY `uq_customer_product` (`customer_id`, `product_id`), -- A customer can only have one entry per product in their cart
        FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE, -- If customer deleted, empty their cart
        FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE -- If product deleted, remove from carts
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'Items in customer shopping carts.';