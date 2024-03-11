-- migrate:up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(72) NOT NULL,
    verified BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX users_email_idx ON users(email);

CREATE FUNCTION update_timestamp()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_timestamp();

CREATE TABLE users_audit (
    id INTEGER,
    email VARCHAR(100),
    password_hash VARCHAR(72),
    verified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE FUNCTION log_user_changes()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO users_audit VALUES (
        OLD.id,
        OLD.email,
        OLD.password_hash,
        OLD.verified,
        OLD.created_at,
        NOW(),
        OLD.deleted_at
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER log_user_changes
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION log_user_changes();


-- migrate:down
DROP TABLE users_audit;
DROP TABLE users;
DROP FUNCTION update_timestamp;
DROP FUNCTION log_user_changes;
