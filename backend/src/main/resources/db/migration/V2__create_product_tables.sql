CREATE TABLE products (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          seller_id BIGINT NOT NULL,
                          title VARCHAR(140) NOT NULL,
                          description TEXT NOT NULL,
                          category VARCHAR(60) NOT NULL,
                          item_condition VARCHAR(40) NOT NULL,
                          price DECIMAL(10, 2) NOT NULL,
                          campus VARCHAR(120) NOT NULL,
                          quantity INT NOT NULL,
                          status VARCHAR(40) NOT NULL,
                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          CONSTRAINT fk_products_seller
                              FOREIGN KEY (seller_id) REFERENCES users (id)
);

CREATE INDEX idx_products_seller_id
    ON products (seller_id);

CREATE INDEX idx_products_category
    ON products (category);

CREATE INDEX idx_products_status
    ON products (status);

CREATE TABLE product_images (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                product_id BIGINT NOT NULL,
                                image_url VARCHAR(500) NOT NULL,
                                file_name VARCHAR(255) NOT NULL,
                                content_type VARCHAR(120) NOT NULL,
                                sort_order INT NOT NULL,
                                created_at TIMESTAMP NOT NULL,
                                CONSTRAINT fk_product_images_product
                                    FOREIGN KEY (product_id) REFERENCES products (id)
                                        ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product_id
    ON product_images (product_id);