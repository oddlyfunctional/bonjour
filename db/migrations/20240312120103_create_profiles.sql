-- migrate:up
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_timestamp();

CREATE TABLE profiles_audit (
    id INTEGER,
    name VARCHAR,
    avatar_url VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION log_profile_changes()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO profiles_audit (
        id,
        name,
        avatar_url,
        created_at,
        updated_at
    ) VALUES (
        OLD.id,
        OLD.name,
        OLD.avatar_url,
        OLD.created_at,
        NOW()
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER log_profile_changes
    AFTER UPDATE ON profiles
    FOR EACH ROW
    WHEN (
        OLD.name IS DISTINCT FROM NEW.name
        OR OLD.avatar_url IS DISTINCT FROM NEW.avatar_url
    ) EXECUTE FUNCTION log_profile_changes();


-- migrate:down
DROP TABLE profiles;
DROP FUNCTION log_profile_changes;
