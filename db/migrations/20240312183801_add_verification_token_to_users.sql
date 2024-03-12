-- migrate:up
ALTER TABLE users
    ADD COLUMN verification_token CHAR(32);

CREATE UNIQUE INDEX users_verification_token_idx ON users(verification_token);

ALTER TABLE users_audit
    ADD COLUMN verification_token TEXT;

CREATE OR REPLACE FUNCTION log_user_changes()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO users_audit (
        id,
        email,
        password_hash,
        verified,
        profile_id,
        verification_token,
        created_at,
        updated_at,
        deleted_at
    ) VALUES (
        OLD.id,
        OLD.email,
        OLD.password_hash,
        OLD.verified,
        OLD.profile_id,
        OLD.verification_token,
        OLD.created_at,
        NOW(),
        OLD.deleted_at
    );

    RETURN NEW;
END;
$$;

-- migrate:down
ALTER TABLE users_audit
    DROP COLUMN verification_token;
ALTER TABLE users
    DROP COLUMN verification_token;
