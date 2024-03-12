-- migrate:up
ALTER TABLE users
    ADD COLUMN profile_id INTEGER,
    ADD CONSTRAINT fk_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id);

ALTER TABLE users_audit
    ADD COLUMN profile_id INTEGER;

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
        created_at,
        updated_at,
        deleted_at
    ) VALUES (
        OLD.id,
        OLD.email,
        OLD.password_hash,
        OLD.verified,
        OLD.profile_id,
        OLD.created_at,
        NOW(),
        OLD.deleted_at
    );

    RETURN NEW;
END;
$$;

-- migrate:down
ALTER TABLE users_audit
    DROP COLUMN profile_id;
ALTER TABLE users
    DROP COLUMN profile_id;
