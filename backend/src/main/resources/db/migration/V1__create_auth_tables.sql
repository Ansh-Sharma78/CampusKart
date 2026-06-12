CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       full_name VARCHAR(120) NOT NULL,
                       email VARCHAR(180) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(30) NOT NULL,
                       email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,
                       CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE email_verification_tokens (
                                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                           user_id BIGINT NOT NULL,
                                           token_hash VARCHAR(88) NOT NULL,
                                           expires_at TIMESTAMP NOT NULL,
                                           used_at TIMESTAMP NULL,
                                           created_at TIMESTAMP NOT NULL,
                                           CONSTRAINT uk_email_verification_tokens_token_hash UNIQUE (token_hash),
                                           CONSTRAINT fk_email_verification_tokens_user
                                               FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_email_verification_tokens_user_id
    ON email_verification_tokens (user_id);

CREATE TABLE refresh_tokens (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                token_hash VARCHAR(88) NOT NULL,
                                expires_at TIMESTAMP NOT NULL,
                                revoked_at TIMESTAMP NULL,
                                created_at TIMESTAMP NOT NULL,
                                CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash),
                                CONSTRAINT fk_refresh_tokens_user
                                    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);