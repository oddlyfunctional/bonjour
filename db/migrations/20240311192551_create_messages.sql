-- migrate:up
CREATE TYPE DELIVERY_STATUS AS ENUM ('Pending', 'Sent', 'Seen');
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    delivery_status DELIVERY_STATUS NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat FOREIGN KEY(chat_id) REFERENCES chats(id),
    CONSTRAINT fk_author FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE INDEX messages_author_id_idx ON messages(author_id);
CREATE INDEX messages_chat_id_sent_at_idx ON messages(chat_id, sent_at DESC);

-- migrate:down
DROP TABLE messages;
DROP TYPE DELIVERY_STATUS;
