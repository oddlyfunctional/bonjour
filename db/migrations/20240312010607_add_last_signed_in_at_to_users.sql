-- migrate:up
ALTER TABLE users
    ADD COLUMN last_signed_in_at TIMESTAMP;

-- migrate:down
ALTER TABLE users
    DROP COLUMN last_signed_in_at;
