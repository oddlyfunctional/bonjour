-- migrate:up
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin FOREIGN KEY(admin_id) REFERENCES users(id)
);

CREATE INDEX chats_admin_id_idx ON chats(admin_id);

CREATE TRIGGER update_chat_timestamp
    BEFORE UPDATE ON chats
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_timestamp();

-- migrate:down
DROP TABLE chats;
