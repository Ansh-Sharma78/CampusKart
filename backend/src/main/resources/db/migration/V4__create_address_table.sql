CREATE TABLE addresses (
                           id BIGINT NOT NULL AUTO_INCREMENT,
                           user_id BIGINT NOT NULL,
                           recipient_name VARCHAR(120) NOT NULL,
                           phone_number VARCHAR(20) NOT NULL,
                           line1 VARCHAR(180) NOT NULL,
                           line2 VARCHAR(180),
                           city VARCHAR(100) NOT NULL,
                           state VARCHAR(100) NOT NULL,
                           postal_code VARCHAR(20) NOT NULL,
                           campus VARCHAR(120) NOT NULL,
                           default_address BOOLEAN NOT NULL DEFAULT FALSE,
                           created_at TIMESTAMP NOT NULL,
                           updated_at TIMESTAMP NOT NULL,

                           CONSTRAINT pk_addresses PRIMARY KEY (id),
                           CONSTRAINT fk_addresses_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);