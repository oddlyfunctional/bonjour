-- migrate:up
CREATE TABLE chats_users (
    user_id INTEGER NOT NULL,
    chat_id INTEGER NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat
        FOREIGN KEY(chat_id)
        REFERENCES chats(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX chats_users_idx ON chats_users(user_id, chat_id);
CREATE INDEX chats_users_chat_id_idx ON chats_users(chat_id);

-- migrate:down
DROP TABLE chats_users;
