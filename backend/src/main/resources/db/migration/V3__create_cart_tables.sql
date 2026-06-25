CREATE TABLE carts (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       user_id BIGINT NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,

                       CONSTRAINT pk_carts PRIMARY KEY (id),
                       CONSTRAINT uq_carts_user_id UNIQUE (user_id),
                       CONSTRAINT fk_carts_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE cart_items (
                            id BIGINT NOT NULL AUTO_INCREMENT,
                            cart_id BIGINT NOT NULL,
                            product_id BIGINT NOT NULL,
                            quantity INT NOT NULL,
                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP NOT NULL,

                            CONSTRAINT pk_cart_items PRIMARY KEY (id),
                            CONSTRAINT fk_cart_items_cart_id FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
                            CONSTRAINT fk_cart_items_product_id FOREIGN KEY (product_id) REFERENCES products (id),
                            CONSTRAINT uq_cart_items_cart_product UNIQUE (cart_id, product_id),
                            CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items (product_id);