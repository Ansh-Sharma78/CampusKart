CREATE TABLE payments (
                          id BIGINT NOT NULL AUTO_INCREMENT,
                          order_id BIGINT NOT NULL,
                          user_id BIGINT NOT NULL,

                          provider VARCHAR(40) NOT NULL,
                          status VARCHAR(40) NOT NULL,

                          amount DECIMAL(12, 2) NOT NULL,
                          currency VARCHAR(10) NOT NULL,

                          provider_order_id VARCHAR(120),
                          provider_payment_id VARCHAR(120),

                          failure_reason VARCHAR(500),

                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          confirmed_at TIMESTAMP NULL,
                          failed_at TIMESTAMP NULL,

                          CONSTRAINT pk_payments PRIMARY KEY (id),

                          CONSTRAINT fk_payments_order
                              FOREIGN KEY (order_id)
                                  REFERENCES orders (id),

                          CONSTRAINT fk_payments_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users (id),

                          CONSTRAINT chk_payments_amount
                              CHECK (amount >= 0)
);

CREATE INDEX idx_payments_order
    ON payments (order_id);

CREATE INDEX idx_payments_user_created
    ON payments (user_id, created_at);

CREATE INDEX idx_payments_status
    ON payments (status);

CREATE INDEX idx_payments_provider_payment
    ON payments (provider_payment_id);

