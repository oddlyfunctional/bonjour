SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: delivery_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.delivery_status AS ENUM (
    'Pending',
    'Sent',
    'Seen'
);


--
-- Name: log_profile_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_profile_changes() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: log_user_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_user_changes() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chats (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    admin_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: chats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;


--
-- Name: chats_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chats_users (
    user_id integer NOT NULL,
    chat_id integer NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    chat_id integer NOT NULL,
    author_id integer NOT NULL,
    body text NOT NULL,
    delivery_status public.delivery_status NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    name character varying,
    avatar_url character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: profiles_audit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles_audit (
    id integer,
    name character varying,
    avatar_url character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(72) NOT NULL,
    verified boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    last_signed_in_at timestamp without time zone,
    profile_id integer,
    verification_token character(32)
);


--
-- Name: users_audit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_audit (
    id integer,
    email character varying(100),
    password_hash character varying(72),
    verified boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    profile_id integer,
    verification_token text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: chats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: chats_admin_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chats_admin_id_idx ON public.chats USING btree (admin_id);


--
-- Name: chats_users_chat_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chats_users_chat_id_idx ON public.chats_users USING btree (chat_id);


--
-- Name: chats_users_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chats_users_idx ON public.chats_users USING btree (user_id, chat_id);


--
-- Name: messages_author_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_author_id_idx ON public.messages USING btree (author_id);


--
-- Name: messages_chat_id_sent_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_chat_id_sent_at_idx ON public.messages USING btree (chat_id, sent_at DESC);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_verification_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_verification_token_idx ON public.users USING btree (verification_token);


--
-- Name: profiles log_profile_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER log_profile_changes AFTER UPDATE ON public.profiles FOR EACH ROW WHEN ((((old.name)::text IS DISTINCT FROM (new.name)::text) OR ((old.avatar_url)::text IS DISTINCT FROM (new.avatar_url)::text))) EXECUTE FUNCTION public.log_profile_changes();


--
-- Name: users log_user_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER log_user_changes AFTER UPDATE ON public.users FOR EACH ROW WHEN ((((old.email)::text IS DISTINCT FROM (new.email)::text) OR (old.verified IS DISTINCT FROM new.verified))) EXECUTE FUNCTION public.log_user_changes();


--
-- Name: chats update_chat_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_chat_timestamp BEFORE UPDATE ON public.chats FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.update_timestamp();


--
-- Name: profiles update_profiles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.update_timestamp();


--
-- Name: users update_user_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_timestamp BEFORE UPDATE ON public.users FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.update_timestamp();


--
-- Name: chats fk_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: messages fk_author; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: messages fk_chat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: chats_users fk_chat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats_users
    ADD CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: users fk_profile; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES public.profiles(id);


--
-- Name: chats_users fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats_users
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20240311184146'),
    ('20240311192103'),
    ('20240311192551'),
    ('20240311200827'),
    ('20240312004951'),
    ('20240312010607'),
    ('20240312120103'),
    ('20240312121030'),
    ('20240312183801');
