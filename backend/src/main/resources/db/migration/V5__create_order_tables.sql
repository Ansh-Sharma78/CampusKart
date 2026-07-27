CREATE TABLE orders (
                        id BIGINT NOT NULL AUTO_INCREMENT,
                        user_id BIGINT NOT NULL,
                        delivery_address_id BIGINT,
                        status VARCHAR(40) NOT NULL,
                        subtotal DECIMAL(12, 2) NOT NULL,
                        total_amount DECIMAL(12, 2) NOT NULL,

                        recipient_name VARCHAR(120) NOT NULL,
                        phone_number VARCHAR(20) NOT NULL,
                        address_line1 VARCHAR(180) NOT NULL,
                        address_line2 VARCHAR(180),
                        city VARCHAR(100) NOT NULL,
                        state VARCHAR(100) NOT NULL,
                        postal_code VARCHAR(20) NOT NULL,
                        campus VARCHAR(120) NOT NULL,

                        created_at TIMESTAMP NOT NULL,
                        updated_at TIMESTAMP NOT NULL,
                        cancelled_at TIMESTAMP NULL,

                        CONSTRAINT pk_orders PRIMARY KEY (id),

                        CONSTRAINT fk_orders_user
                            FOREIGN KEY (user_id)
                                REFERENCES users (id),

                        CONSTRAINT fk_orders_delivery_address
                            FOREIGN KEY (delivery_address_id)
                                REFERENCES addresses (id)
                                ON DELETE SET NULL,

                        CONSTRAINT chk_orders_subtotal
                            CHECK (subtotal >= 0),

                        CONSTRAINT chk_orders_total_amount
                            CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_user_created
    ON orders (user_id, created_at);

CREATE INDEX idx_orders_status
    ON orders (status);


CREATE TABLE order_items (
                             id BIGINT NOT NULL AUTO_INCREMENT,
                             order_id BIGINT NOT NULL,
                             product_id BIGINT NOT NULL,

                             product_title VARCHAR(140) NOT NULL,
                             product_image_url VARCHAR(500),
                             unit_price DECIMAL(10, 2) NOT NULL,
                             quantity INT NOT NULL,
                             line_total DECIMAL(12, 2) NOT NULL,

                             created_at TIMESTAMP NOT NULL,

                             CONSTRAINT pk_order_items PRIMARY KEY (id),

                             CONSTRAINT fk_order_items_order
                                 FOREIGN KEY (order_id)
                                     REFERENCES orders (id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_order_items_product
                                 FOREIGN KEY (product_id)
                                     REFERENCES products (id),

                             CONSTRAINT chk_order_items_quantity
                                 CHECK (quantity > 0),

                             CONSTRAINT chk_order_items_unit_price
                                 CHECK (unit_price >= 0),

                             CONSTRAINT chk_order_items_line_total
                                 CHECK (line_total >= 0)
);

CREATE INDEX idx_order_items_order
    ON order_items (order_id);

CREATE INDEX idx_order_items_product
    ON order_items (product_id);