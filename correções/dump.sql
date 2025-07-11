--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator GRANTED BY postgres;
GRANT anon TO postgres GRANTED BY supabase_admin;
GRANT authenticated TO authenticator GRANTED BY postgres;
GRANT authenticated TO postgres GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user GRANTED BY postgres;
GRANT pg_signal_backend TO postgres GRANTED BY supabase_admin;
GRANT service_role TO authenticator GRANTED BY postgres;
GRANT service_role TO postgres GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres GRANTED BY supabase_admin;






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

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
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: calculate_points(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_points() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
    calculated_points NUMERIC;
    competence_rec RECORD;
BEGIN
    -- Busca os detalhes da competência
    SELECT *
    INTO competence_rec
    FROM public.competences
    WHERE id = p_competence_id;

    -- Se não encontrar a competência, retorna 0
    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- Lógica de cálculo
    calculated_points := p_quantity * competence_rec.points_per_unit;

    -- Aplica a pontuação máxima
    IF calculated_points > competence_rec.max_points THEN
        calculated_points := competence_rec.max_points;
    END IF;

    RETURN calculated_points;
END;$$;


ALTER FUNCTION public.calculate_points() OWNER TO postgres;

--
-- Name: set_user_fields_from_jwt(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_user_fields_from_jwt() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$-- Vá em Database -> Functions -> set_user_fields_from_jwt e substitua a definição pelo código abaixo:
BEGIN
  -- Define o ID a partir do JWT
  NEW.id := auth.uid();

  -- Define o email a partir do JWT (geralmente sempre presente)
  NEW.email := auth.jwt()->>'email';

  -- Tenta obter o nome de vários locais no metadata, com um fallback para o email
  NEW.name := COALESCE(
    auth.jwt()->'user_metadata'->>'full_name',
    auth.jwt()->'raw_user_meta_data'->>'name',
    auth.jwt()->'user_metadata'->>'name',
    auth.jwt()->>'email' -- Fallback final para garantir que não seja nulo
  );
  
  -- Obtém outros campos do metadata se existirem
  NEW.idjob := auth.jwt()->'user_metadata'->>'matricula';
  NEW.job := auth.jwt()->'user_metadata'->>'cargo';
  
  -- Define um perfil padrão se não vier no metadata
  NEW.profile := COALESCE(auth.jwt()->'user_metadata'->>'profile', 'servidor');

  RETURN NEW;
END;$$;


ALTER FUNCTION public.set_user_fields_from_jwt() OWNER TO postgres;

--
-- Name: set_user_id_from_auth(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_user_id_from_auth() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  NEW.id := auth.uid();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_user_id_from_auth() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: competences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.competences (
    id character varying(50) NOT NULL,
    category character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    points_per_unit numeric(5,2) NOT NULL,
    max_points numeric(5,2) NOT NULL,
    unit character varying(50) NOT NULL,
    validation_rules jsonb
);


ALTER TABLE public.competences OWNER TO postgres;

--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profile (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    idjob character varying(255),
    job character varying(255),
    profile character varying(50),
    date_singin timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profile OWNER TO postgres;

--
-- Name: user_rsc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rsc (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    competence_id character varying(50) NOT NULL,
    quantity numeric NOT NULL,
    value numeric(10,2) NOT NULL,
    data_inicio date,
    data_fim date,
    date_awarded timestamp with time zone DEFAULT now() NOT NULL,
    data_atualizacao timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_rsc OWNER TO postgres;

--
-- Name: user_rsc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_rsc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_rsc_id_seq OWNER TO postgres;

--
-- Name: user_rsc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_rsc_id_seq OWNED BY public.user_rsc.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: user_rsc id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rsc ALTER COLUMN id SET DEFAULT nextval('public.user_rsc_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	86055dbf-14bb-4035-965f-1d087b30dad3	{"action":"user_signedup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-05-20 19:17:24.146716+00	
00000000-0000-0000-0000-000000000000	2cb60287-5847-488b-a023-fb0362218648	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-20 19:20:45.706626+00	
00000000-0000-0000-0000-000000000000	ad0228aa-dd91-4371-a78d-4724f333868f	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-20 19:21:32.402395+00	
00000000-0000-0000-0000-000000000000	832c9e95-8eb7-4a4e-95de-3476126c6e15	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-20 19:25:26.39952+00	
00000000-0000-0000-0000-000000000000	43903a82-b72b-40ba-8345-3aab3ffff559	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-20 19:25:43.308141+00	
00000000-0000-0000-0000-000000000000	3b32fd55-a621-462e-a057-3ed1d1027460	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-20 19:27:51.445466+00	
00000000-0000-0000-0000-000000000000	8875e160-254c-441e-9fb6-049ed82e4a1a	{"action":"user_signedup","actor_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","actor_name":"Daniel Regis de Franca Cirino","actor_username":"daniel.regis@ifce.edu.br","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-05-20 19:33:47.480464+00	
00000000-0000-0000-0000-000000000000	9369a950-4ce8-4706-93d1-a34a50d150c1	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 12:00:16.890894+00	
00000000-0000-0000-0000-000000000000	e8c60900-a618-4116-8d2a-6ae78c66c638	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:01:13.721522+00	
00000000-0000-0000-0000-000000000000	d46e83f7-86cb-4101-95d1-702ffb0efc29	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 12:01:18.994119+00	
00000000-0000-0000-0000-000000000000	057339e7-dd74-49e3-ad56-7176dea6c719	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:07:05.380458+00	
00000000-0000-0000-0000-000000000000	277a9564-66bb-4c05-b167-b335aa813050	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 12:07:08.122449+00	
00000000-0000-0000-0000-000000000000	bb4038e8-8dca-43f8-a5a8-76ac4546e36c	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:07:10.728667+00	
00000000-0000-0000-0000-000000000000	0e911ca4-8c51-4494-b718-807e376742a8	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 12:07:14.800869+00	
00000000-0000-0000-0000-000000000000	251a388d-ad0c-4a7e-acb1-3618adf3dfa6	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:07:17.538055+00	
00000000-0000-0000-0000-000000000000	d1ac0db6-989b-42e2-9c8f-3674e95959c6	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:21:09.397805+00	
00000000-0000-0000-0000-000000000000	cb740906-02e0-47ea-9c56-8c6e9052e464	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:23:43.033373+00	
00000000-0000-0000-0000-000000000000	e5d59d89-f29e-4e12-b008-62d2870d41ce	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 12:24:26.774329+00	
00000000-0000-0000-0000-000000000000	24ac8b74-415e-4609-be3d-b66065e9302a	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:24:29.865784+00	
00000000-0000-0000-0000-000000000000	e23e89f8-286d-41f2-8375-a5c642624b91	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 12:24:37.783475+00	
00000000-0000-0000-0000-000000000000	d9e36819-57ce-4c05-b62c-7cff64500c13	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:24:43.433422+00	
00000000-0000-0000-0000-000000000000	373509ba-1096-4bbe-943b-efcd50cdf282	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:26:23.938002+00	
00000000-0000-0000-0000-000000000000	c1d91b5a-ee05-4928-a4ca-93d2acf5de94	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 12:28:56.845094+00	
00000000-0000-0000-0000-000000000000	9d1a2ee4-cbf2-433e-8a69-92ba3911964e	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 13:25:47.459791+00	
00000000-0000-0000-0000-000000000000	38a4ae6b-4d47-49fd-b5ce-ef321181afcd	{"action":"token_refreshed","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-21 13:47:25.459918+00	
00000000-0000-0000-0000-000000000000	47981b1f-bccd-4f33-a610-625ef229b5e5	{"action":"token_revoked","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-21 13:47:25.461358+00	
00000000-0000-0000-0000-000000000000	25a1f8bd-bfda-4703-9509-1c75073dc47d	{"action":"logout","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-21 13:47:43.950711+00	
00000000-0000-0000-0000-000000000000	3543cc0d-31a6-4c5d-8fd9-5e3147e20ab9	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-24 23:28:13.892422+00	
00000000-0000-0000-0000-000000000000	aa7aebc7-ac1c-4bc0-9e67-11367e25e54b	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 13:48:08.862649+00	
00000000-0000-0000-0000-000000000000	9a673953-ecd5-442e-a68a-788b45d223dc	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 13:49:28.308137+00	
00000000-0000-0000-0000-000000000000	71f55bab-954a-4b6d-98e5-59242787f89f	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 13:55:10.407112+00	
00000000-0000-0000-0000-000000000000	8b9b51d0-e024-4b81-b1d9-59b75c343e38	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:13:20.925936+00	
00000000-0000-0000-0000-000000000000	de9f5b31-77d2-4099-8b9d-576f169bfdb6	{"action":"user_recovery_requested","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-05-21 14:13:37.476072+00	
00000000-0000-0000-0000-000000000000	9e38cb4b-8b97-43fd-932b-b4235f7ddab0	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:14:58.782051+00	
00000000-0000-0000-0000-000000000000	5a0bd9d4-06c6-4806-9580-562a9c510568	{"action":"user_confirmation_requested","actor_id":"3621b219-d2a4-41f7-bf04-2544683bc00f","actor_name":"cicero","actor_username":"cicero@teste.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:23:38.774739+00	
00000000-0000-0000-0000-000000000000	028c6222-94b4-4930-b822-eceff39ea2be	{"action":"user_confirmation_requested","actor_id":"07a154b0-db39-4099-ace7-bfc312757577","actor_name":"cicero","actor_username":"cicerosilva@teste.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:30:44.820803+00	
00000000-0000-0000-0000-000000000000	42f34924-d787-4d47-9d4d-63de0fdae90f	{"action":"user_confirmation_requested","actor_id":"07a154b0-db39-4099-ace7-bfc312757577","actor_name":"cicero","actor_username":"cicerosilva@teste.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:35:16.662493+00	
00000000-0000-0000-0000-000000000000	7b30635c-aabf-45b9-a701-6232737008fb	{"action":"user_confirmation_requested","actor_id":"07a154b0-db39-4099-ace7-bfc312757577","actor_name":"cicero","actor_username":"cicerosilva@teste.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:36:45.421799+00	
00000000-0000-0000-0000-000000000000	adfd6c92-af78-4bae-be79-23b25a1cc49f	{"action":"user_confirmation_requested","actor_id":"07a154b0-db39-4099-ace7-bfc312757577","actor_name":"cicero","actor_username":"cicerosilva@teste.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:44:40.438903+00	
00000000-0000-0000-0000-000000000000	091138e1-5762-4127-8581-ca36b6509af0	{"action":"user_confirmation_requested","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 14:45:24.529209+00	
00000000-0000-0000-0000-000000000000	c27dfbc6-8990-4a37-b987-bacfd792383e	{"action":"user_signedup","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"team"}	2025-05-21 14:46:06.096347+00	
00000000-0000-0000-0000-000000000000	f425251c-bfa6-4b45-8088-070f0e941eb2	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:13:12.932964+00	
00000000-0000-0000-0000-000000000000	112d985d-ad11-45b3-98d1-c097c95458bd	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:18:56.595117+00	
00000000-0000-0000-0000-000000000000	5c7a128c-bf49-460c-9d61-100c6d5b1761	{"action":"token_refreshed","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-21 15:21:18.215488+00	
00000000-0000-0000-0000-000000000000	b1bb6514-306b-402f-abf1-08479526f4e9	{"action":"token_revoked","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-21 15:21:18.216263+00	
00000000-0000-0000-0000-000000000000	3cec5186-0c96-4fcd-aea1-687bed408e20	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:23:14.860212+00	
00000000-0000-0000-0000-000000000000	a2c8d77d-7ef3-4f1b-993a-fc3f23e55a20	{"action":"user_repeated_signup","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 15:35:18.742464+00	
00000000-0000-0000-0000-000000000000	2d2eb99a-1054-4a55-b48f-5366ce51ddf7	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 15:35:24.973403+00	
00000000-0000-0000-0000-000000000000	cf37b1e2-009b-4704-b4a0-5cd75ec18fd5	{"action":"user_repeated_signup","actor_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","actor_name":"Daniel Regis de Franca Cirino","actor_username":"daniel.regis@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 15:36:50.024833+00	
00000000-0000-0000-0000-000000000000	646622f4-b37d-4ffb-8095-117166680ec0	{"action":"user_signedup","actor_id":"49463842-aec0-4e08-bf6a-51fe0b5f467d","actor_name":"Daniel Régis","actor_username":"danielcirino@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-05-21 15:37:35.887528+00	
00000000-0000-0000-0000-000000000000	eefe73d8-7a43-4b6a-a431-2d74003d5db8	{"action":"login","actor_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","actor_name":"Daniel Regis de Franca Cirino","actor_username":"daniel.regis@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:38:08.755722+00	
00000000-0000-0000-0000-000000000000	9cdd7fb6-4d23-4781-9dd0-183575798774	{"action":"user_recovery_requested","actor_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","actor_name":"Daniel Regis de Franca Cirino","actor_username":"daniel.regis@ifce.edu.br","actor_via_sso":false,"log_type":"user"}	2025-05-21 15:39:38.331148+00	
00000000-0000-0000-0000-000000000000	15154c15-ba60-4960-b990-19665d42acc9	{"action":"login","actor_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","actor_name":"Daniel Regis de Franca Cirino","actor_username":"daniel.regis@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-21 15:39:57.731884+00	
00000000-0000-0000-0000-000000000000	4ca6abee-92fc-4daf-9bda-0cc442274f41	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:42:44.908708+00	
00000000-0000-0000-0000-000000000000	56f318b0-0ca9-474e-80bf-a24510fc00a0	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 15:43:10.913618+00	
00000000-0000-0000-0000-000000000000	a51a05b7-70d0-4039-9a59-061afc4fc259	{"action":"user_confirmation_requested","actor_id":"c946613a-1f70-498e-86f6-7fba96ce1297","actor_name":"Debora Viana de Araujo","actor_username":"deboravia@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 16:06:42.972739+00	
00000000-0000-0000-0000-000000000000	9a633f05-2de7-47a9-a141-2a17141f7fca	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 16:16:07.921258+00	
00000000-0000-0000-0000-000000000000	10a0a37d-9458-4b55-a7f2-fb3476404d6d	{"action":"user_confirmation_requested","actor_id":"4232a190-38d6-4f86-92ad-3248e23b4e9e","actor_name":"teste","actor_username":"tese@teste.email.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 16:48:47.097581+00	
00000000-0000-0000-0000-000000000000	0c141bb7-b7d7-4806-8d10-e21819b5a306	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 16:57:52.010176+00	
00000000-0000-0000-0000-000000000000	7d5a862e-0454-44c3-b4c6-be3c4bbc6f84	{"action":"user_repeated_signup","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 16:58:18.423085+00	
00000000-0000-0000-0000-000000000000	a92a1fd7-1962-447f-a1bc-e00405807a70	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 16:59:59.613574+00	
00000000-0000-0000-0000-000000000000	31bfb48a-8c16-4866-a948-01133992e026	{"action":"login","actor_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-21 17:25:26.386519+00	
00000000-0000-0000-0000-000000000000	111da905-80eb-4dbb-9d0c-5120f91361d8	{"action":"user_repeated_signup","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 17:33:34.6438+00	
00000000-0000-0000-0000-000000000000	fee5396f-ce07-4b77-9966-fba4c774be8c	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 17:33:40.711161+00	
00000000-0000-0000-0000-000000000000	d832fb16-8ae5-4a01-b90f-ccdd904c20d6	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 17:40:51.674822+00	
00000000-0000-0000-0000-000000000000	7b1590e3-def8-4a16-8438-3e3dea406a20	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 17:43:02.011282+00	
00000000-0000-0000-0000-000000000000	6fa8249e-9d15-4466-a1b1-462516bad9e1	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 18:15:09.643784+00	
00000000-0000-0000-0000-000000000000	915d9d49-3d2a-4056-857b-5f50c76ead89	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 18:22:08.244467+00	
00000000-0000-0000-0000-000000000000	7fab8d40-2699-42b6-9763-69d527787dfc	{"action":"login","actor_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-21 18:25:32.946572+00	
00000000-0000-0000-0000-000000000000	6b1f68ed-dbb8-4313-a71c-44c6f10cf42d	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cicero.silva@ifce.edu.br","user_id":"36554cb8-2e31-4a35-8d88-6980d75784aa","user_phone":""}}	2025-05-21 19:30:38.056686+00	
00000000-0000-0000-0000-000000000000	34c4d607-e78b-4361-9eee-4bad5b85328c	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"daniel.regis@ifce.edu.br","user_id":"779b28e9-c262-4aa6-9ff1-b2d10c7af23b","user_phone":""}}	2025-05-21 19:30:38.058547+00	
00000000-0000-0000-0000-000000000000	19889fcb-e960-4813-957b-36ea0d84a392	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cicerosilva.ifce@gmail.com","user_id":"9ae5731e-25c1-46da-bf51-55299889a7e9","user_phone":""}}	2025-05-21 19:30:38.058975+00	
00000000-0000-0000-0000-000000000000	d18411c9-f431-4b0c-b21c-4bb13f7922db	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"deboravia@gmail.com","user_id":"c946613a-1f70-498e-86f6-7fba96ce1297","user_phone":""}}	2025-05-21 19:30:38.066397+00	
00000000-0000-0000-0000-000000000000	4cb21179-60f2-4f34-8a8f-e338e17d351f	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"tese@teste.email.com","user_id":"4232a190-38d6-4f86-92ad-3248e23b4e9e","user_phone":""}}	2025-05-21 19:30:38.076144+00	
00000000-0000-0000-0000-000000000000	07c20bcf-6f31-4200-a014-6efc51782913	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cicerosilva@teste.com.br","user_id":"07a154b0-db39-4099-ace7-bfc312757577","user_phone":""}}	2025-05-21 19:30:38.076758+00	
00000000-0000-0000-0000-000000000000	3eeeb4e0-4def-47f8-b5ad-af979f77da96	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cicero@teste.com.br","user_id":"3621b219-d2a4-41f7-bf04-2544683bc00f","user_phone":""}}	2025-05-21 19:30:38.089237+00	
00000000-0000-0000-0000-000000000000	81fb5b94-9f2e-46eb-80fe-6ad1c7c470e2	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"danielcirino@gmail.com","user_id":"49463842-aec0-4e08-bf6a-51fe0b5f467d","user_phone":""}}	2025-05-21 19:30:38.126387+00	
00000000-0000-0000-0000-000000000000	3792aa2f-5d7d-45aa-9eaf-371bcc1a2e35	{"action":"user_confirmation_requested","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-21 19:37:45.496875+00	
00000000-0000-0000-0000-000000000000	efef0434-f9e3-476d-97e7-4963fdbe2fe2	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 23:28:27.693756+00	
00000000-0000-0000-0000-000000000000	7277802e-3f2c-4f59-813c-466f9082fcb3	{"action":"user_signedup","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-05-21 19:38:31.70921+00	
00000000-0000-0000-0000-000000000000	3b773371-32f7-4f6d-98ba-2251838d1e81	{"action":"token_refreshed","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-22 13:19:52.512043+00	
00000000-0000-0000-0000-000000000000	5d4a8d0e-ba35-4ec8-a34c-674a6d3d9673	{"action":"token_revoked","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-22 13:19:52.520014+00	
00000000-0000-0000-0000-000000000000	3a64673c-7ac6-408d-820d-61658146f981	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-22 14:17:14.944442+00	
00000000-0000-0000-0000-000000000000	c00cec1c-50db-4220-a482-522068efe92f	{"action":"user_confirmation_requested","actor_id":"cf1c8df4-5292-4733-bd73-2d3627091442","actor_name":"teste","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-22 14:19:36.306199+00	
00000000-0000-0000-0000-000000000000	7846b571-615a-47fe-88c5-b63b071fa834	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cicero.silva@ifce.edu.br","user_id":"cf1c8df4-5292-4733-bd73-2d3627091442","user_phone":""}}	2025-05-22 14:20:32.028013+00	
00000000-0000-0000-0000-000000000000	4418c8f9-7340-4da5-aa07-6988baf1c163	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-22 14:35:46.371559+00	
00000000-0000-0000-0000-000000000000	acb6af3c-ff40-4bb8-8804-bcaab101b94e	{"action":"user_confirmation_requested","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-05-22 17:45:31.88802+00	
00000000-0000-0000-0000-000000000000	748cc7f5-c502-424a-8953-543872cfd5b1	{"action":"user_signedup","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"team"}	2025-05-22 17:46:03.632846+00	
00000000-0000-0000-0000-000000000000	8d332cb1-382c-4867-9590-14c4d1c5a354	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 17:46:14.837162+00	
00000000-0000-0000-0000-000000000000	5d2596e3-4a44-4e93-8d7f-5af714f9c947	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 18:00:55.950765+00	
00000000-0000-0000-0000-000000000000	0298824a-1d97-4395-8878-c3cedfc141da	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-22 18:01:32.936366+00	
00000000-0000-0000-0000-000000000000	478f8548-1e67-4aee-b338-39afa7f22066	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 18:01:47.932436+00	
00000000-0000-0000-0000-000000000000	74645e90-7a47-47f4-a319-31e2dc6e9780	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 18:46:26.779612+00	
00000000-0000-0000-0000-000000000000	84c89156-f888-4db1-86e4-5d849fe472b7	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 18:53:59.029645+00	
00000000-0000-0000-0000-000000000000	7ee48fe8-cb82-4fb4-b47d-404440f0abf1	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 19:25:23.214798+00	
00000000-0000-0000-0000-000000000000	c28e1fb1-44c1-435e-86bd-22c1bf023a79	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-22 19:52:37.437585+00	
00000000-0000-0000-0000-000000000000	e9529147-8a21-48c2-ad65-ad067e340280	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-22 19:52:37.438372+00	
00000000-0000-0000-0000-000000000000	ed705a5f-3e22-4d6d-b0e0-f3d9c3e0fc57	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-22 19:52:53.016728+00	
00000000-0000-0000-0000-000000000000	45b5de4f-9a30-4e56-a50b-c5607e6573f3	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-23 03:51:12.862679+00	
00000000-0000-0000-0000-000000000000	718a3284-0c69-4e39-a659-f39463c96962	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-23 03:51:45.814123+00	
00000000-0000-0000-0000-000000000000	82cc995a-fa26-4dc2-9ecf-f7d2757d696f	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-23 03:54:55.559875+00	
00000000-0000-0000-0000-000000000000	fa8b0b68-930c-4abe-a3ed-be5d51839c9a	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 14:12:45.5282+00	
00000000-0000-0000-0000-000000000000	ab39897c-daea-4260-ba71-e32bd96318db	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 15:31:21.194756+00	
00000000-0000-0000-0000-000000000000	7f42ab1b-9349-4cc6-8169-275a3b82a02b	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 16:00:20.334946+00	
00000000-0000-0000-0000-000000000000	c0f65d65-ee18-46c8-90b6-10fadcb42153	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 21:42:42.614724+00	
00000000-0000-0000-0000-000000000000	c18c83f9-aaff-4162-b2e9-2e6abdda62ba	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-24 23:27:56.330921+00	
00000000-0000-0000-0000-000000000000	64850fac-5cf4-47e5-a29d-656cfe335db1	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-24 23:27:56.333958+00	
00000000-0000-0000-0000-000000000000	a91e0bd5-e015-4b0e-b5ba-3b8f2d6fb48d	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-24 23:28:34.7471+00	
00000000-0000-0000-0000-000000000000	bc1e020c-12f6-4366-8062-1cfddebb18ea	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 23:28:45.540156+00	
00000000-0000-0000-0000-000000000000	4e09c9ba-d1a3-4956-ae06-775c11207003	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-24 23:50:06.440549+00	
00000000-0000-0000-0000-000000000000	96f64389-18ac-494e-a0e5-092d5dc47a83	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 00:02:16.272288+00	
00000000-0000-0000-0000-000000000000	14286fe8-6f5a-49e0-90db-56d280011b51	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-25 03:36:27.875648+00	
00000000-0000-0000-0000-000000000000	7a9f0a7a-ab7e-460f-b51f-fd137a12461f	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-25 03:36:27.879617+00	
00000000-0000-0000-0000-000000000000	a4d2b71f-8426-413e-bc2c-5b08ab9ffe49	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 03:37:00.43188+00	
00000000-0000-0000-0000-000000000000	68a3a0b5-08b8-4c38-9ab3-c67ed141c3eb	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 03:41:36.613953+00	
00000000-0000-0000-0000-000000000000	ce15a814-e5ee-46dd-8543-984104b65ff9	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:00:26.815954+00	
00000000-0000-0000-0000-000000000000	44ecd1e3-91d9-4cec-a869-6a0200007b27	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:13:09.477488+00	
00000000-0000-0000-0000-000000000000	1a0b1f57-3ef8-4905-ab15-606515539e84	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:16:01.53002+00	
00000000-0000-0000-0000-000000000000	878ab9fa-6314-48df-baa7-9bf4033519d4	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:25:23.53138+00	
00000000-0000-0000-0000-000000000000	205b69b5-1743-40e1-b826-486310967a86	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:31:36.387804+00	
00000000-0000-0000-0000-000000000000	fdbb88aa-a8f8-4513-9cd6-e146ba6af580	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:46:48.362335+00	
00000000-0000-0000-0000-000000000000	48d347ab-a5e2-4cfb-81f9-8b42361f36d3	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-25 04:47:45.23233+00	
00000000-0000-0000-0000-000000000000	5fa92626-95e5-4ed2-950d-6e4eef3453b3	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:47:58.199005+00	
00000000-0000-0000-0000-000000000000	5cf61013-40da-4e2f-890a-06d9a55193a7	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 04:49:17.666298+00	
00000000-0000-0000-0000-000000000000	9c6f45fd-ec65-456b-a567-eafdeba0326a	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-25 05:07:17.627104+00	
00000000-0000-0000-0000-000000000000	41738fb9-2033-4c3c-a5f2-30afd0380033	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 02:37:42.405182+00	
00000000-0000-0000-0000-000000000000	a7a4cf7b-a2f7-4ac4-89a5-b23217972dd4	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:00:02.890577+00	
00000000-0000-0000-0000-000000000000	6e434db7-10f1-4425-b8ca-ed96306c0582	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:02:06.55434+00	
00000000-0000-0000-0000-000000000000	0ae8d7b2-f8f3-41ec-99a5-476ba011095f	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:16:53.455282+00	
00000000-0000-0000-0000-000000000000	7230dad9-5fe3-41c4-aeee-b216c0aba6a3	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:26:06.567543+00	
00000000-0000-0000-0000-000000000000	4d84d00c-f335-41e4-8a5c-66cdf98cef0b	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:38:07.770125+00	
00000000-0000-0000-0000-000000000000	926d7c2b-11d9-4e92-b1ef-0128fa43e834	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:46:47.490927+00	
00000000-0000-0000-0000-000000000000	35a2b787-ac78-475a-86a0-260dc08f162c	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 03:52:56.019803+00	
00000000-0000-0000-0000-000000000000	0d3d044f-cb6e-48e0-8bc1-8853b72c1c81	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-26 03:54:51.627947+00	
00000000-0000-0000-0000-000000000000	3b5d4f66-3c4a-48d1-84d5-0be6af87bb6c	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 14:21:00.590044+00	
00000000-0000-0000-0000-000000000000	99347ef7-0192-4d16-8312-b92e56cc228d	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 14:29:12.926433+00	
00000000-0000-0000-0000-000000000000	6a70122b-897f-4a9a-9f4c-d0453ebcb00f	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 14:46:12.648298+00	
00000000-0000-0000-0000-000000000000	ba106eb6-414d-43d3-9a00-905139434d91	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 15:03:19.62027+00	
00000000-0000-0000-0000-000000000000	a59ec17b-5ad7-4ba8-88eb-6082f73a7c89	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 15:30:33.914499+00	
00000000-0000-0000-0000-000000000000	bf8d9280-7dda-4bfd-8e85-4a1619c6f68d	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 15:37:43.169209+00	
00000000-0000-0000-0000-000000000000	b4ebfbb7-ec82-4316-a7d6-f3f9b10c46bc	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 16:33:55.793156+00	
00000000-0000-0000-0000-000000000000	52bdb2f2-ca57-4ce9-b4c8-77e08e53df80	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 16:51:40.114497+00	
00000000-0000-0000-0000-000000000000	10a06e14-1477-4fa8-b34d-6db44f32ac1b	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-26 17:17:06.186846+00	
00000000-0000-0000-0000-000000000000	fc6413f3-8b89-4543-a231-da63416fec39	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-26 19:00:36.935722+00	
00000000-0000-0000-0000-000000000000	540c9a1d-5877-4a97-bc1c-06637cd566bd	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-26 19:00:36.940278+00	
00000000-0000-0000-0000-000000000000	0bc20936-4536-4dca-8d7f-279fb46f4ed0	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-26 19:03:04.708552+00	
00000000-0000-0000-0000-000000000000	dea578d6-40e6-4eac-a85e-ffcef910f794	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 11:58:15.651535+00	
00000000-0000-0000-0000-000000000000	948cab8e-46fb-4399-b828-300ebe464178	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 12:10:42.321306+00	
00000000-0000-0000-0000-000000000000	e0003399-fa82-4f9f-8243-5389c882f6ae	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 13:40:04.663744+00	
00000000-0000-0000-0000-000000000000	831abac7-350e-4c2e-802a-9968b1f45c49	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 13:40:04.66622+00	
00000000-0000-0000-0000-000000000000	d25ce28c-7f82-47c7-bf7c-774f1a74262c	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 13:40:38.792805+00	
00000000-0000-0000-0000-000000000000	574d36b4-5999-4150-88d3-65f53f308924	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 13:45:30.446452+00	
00000000-0000-0000-0000-000000000000	fe1ac1a7-7cb0-4094-8273-9a513b00e9ba	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 13:54:20.190918+00	
00000000-0000-0000-0000-000000000000	1cd28c19-c305-48e6-b115-e707d8e533fb	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 14:00:09.984655+00	
00000000-0000-0000-0000-000000000000	85dbe280-aedc-4c4f-8768-0a6c7cf24159	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 14:54:58.402266+00	
00000000-0000-0000-0000-000000000000	f9fb3ce0-d6b3-4535-9876-6bb711b21d34	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-27 14:55:04.936413+00	
00000000-0000-0000-0000-000000000000	55ab72ff-177c-4713-95ef-4570c7052344	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 14:55:14.038584+00	
00000000-0000-0000-0000-000000000000	01180f3a-de6f-4063-9b75-5e870bb0b80c	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 16:11:08.062517+00	
00000000-0000-0000-0000-000000000000	e9991225-ec24-4784-882f-c293b4226fd4	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 16:11:08.066045+00	
00000000-0000-0000-0000-000000000000	0a44da85-5ad7-4e99-a39c-3993a5cde0c6	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-27 16:11:25.744745+00	
00000000-0000-0000-0000-000000000000	76e21d50-7844-4936-b377-f3ea7bdb1dae	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-27 16:11:32.384387+00	
00000000-0000-0000-0000-000000000000	0f33005f-d636-49c2-ad63-ad7bce584a14	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-05-27 17:01:34.017891+00	
00000000-0000-0000-0000-000000000000	923af396-f366-476f-b335-49716bd1768b	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 17:01:53.311375+00	
00000000-0000-0000-0000-000000000000	b229dfd8-9ff3-45ab-9718-4820d839c116	{"action":"token_refreshed","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 18:21:59.23867+00	
00000000-0000-0000-0000-000000000000	d123c83c-ba08-4cf1-8fb3-3327aecd6ebc	{"action":"token_revoked","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"token"}	2025-05-27 18:21:59.241358+00	
00000000-0000-0000-0000-000000000000	e1b96c8c-5c62-402f-8880-84df2ed4e23d	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 19:32:41.55302+00	
00000000-0000-0000-0000-000000000000	1717e32d-00b5-404d-ba11-1ac49282e470	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-05-27 19:35:01.749854+00	
00000000-0000-0000-0000-000000000000	044f6eab-925a-46f1-90cb-15082ef44f32	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 19:35:12.470742+00	
00000000-0000-0000-0000-000000000000	2d1cedcd-22c2-47c4-9255-7d1841e2f86a	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-29 16:20:23.767801+00	
00000000-0000-0000-0000-000000000000	099e0c5b-d24b-4302-9c11-bde624274abd	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 17:19:44.176508+00	
00000000-0000-0000-0000-000000000000	f52e43b0-4a79-4c7a-97ce-6e191a941719	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-06-02 17:20:15.598112+00	
00000000-0000-0000-0000-000000000000	ae950820-7a72-4333-80c0-770e7412eb25	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 17:20:28.996573+00	
00000000-0000-0000-0000-000000000000	8b60dc44-04a4-40c7-acee-c14a63cb6c5f	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 17:32:01.398073+00	
00000000-0000-0000-0000-000000000000	0459053b-d38c-44e9-89cc-5d60639e7e5b	{"action":"logout","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account"}	2025-06-02 17:32:18.430456+00	
00000000-0000-0000-0000-000000000000	27934988-b27b-46a6-9523-1542017a220b	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 17:32:28.360771+00	
00000000-0000-0000-0000-000000000000	7fc2bcc3-fd3f-466f-8b95-bd354389b9c5	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 17:54:20.457583+00	
00000000-0000-0000-0000-000000000000	49c6b7db-fb9d-4a34-af97-3616720fa6df	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 18:03:23.049654+00	
00000000-0000-0000-0000-000000000000	64f2b1dd-850e-4178-bbd4-4d912de22cf0	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 18:21:50.242352+00	
00000000-0000-0000-0000-000000000000	3b078f60-1118-4f28-bb45-15780aafa206	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 18:32:17.429005+00	
00000000-0000-0000-0000-000000000000	0b42ad60-5dc2-49ef-bb2d-7c5a3a861adb	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 18:33:59.830089+00	
00000000-0000-0000-0000-000000000000	6bca7938-8319-4bff-910f-88c5bc97aa6a	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 18:45:06.88861+00	
00000000-0000-0000-0000-000000000000	b0a038d2-bc26-4acc-92fb-042c9504c9c1	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 19:10:45.781901+00	
00000000-0000-0000-0000-000000000000	ff709fec-a46a-4566-a647-b50363b7616d	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-02 19:16:35.106452+00	
00000000-0000-0000-0000-000000000000	f7738cf0-7b25-4c75-96a0-546289919219	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-02 19:19:31.718988+00	
00000000-0000-0000-0000-000000000000	8b5fdb1c-9238-4949-9dc9-686e04820882	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 04:44:32.808502+00	
00000000-0000-0000-0000-000000000000	f007fbaf-0af7-4bf3-9755-174eb70b41ad	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 04:46:10.21394+00	
00000000-0000-0000-0000-000000000000	5a9ee0eb-7081-4aeb-b7a5-78ec3bcba0fe	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 04:47:59.239309+00	
00000000-0000-0000-0000-000000000000	245a76fb-8c2c-4e7b-8dff-a34cd91cd825	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 05:06:37.111775+00	
00000000-0000-0000-0000-000000000000	e8372e08-bc42-493c-bbec-92a8b598dc13	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 05:08:46.947088+00	
00000000-0000-0000-0000-000000000000	e7c1cba9-31de-404b-b261-5f247b4fcf76	{"action":"token_refreshed","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-20 16:08:26.244155+00	
00000000-0000-0000-0000-000000000000	901e9c58-9eea-4470-87ed-a998faa4fe0b	{"action":"token_revoked","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-20 16:08:26.2459+00	
00000000-0000-0000-0000-000000000000	a86a08b5-8f01-49e3-8eb8-b881505fb468	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 16:16:22.512411+00	
00000000-0000-0000-0000-000000000000	5388586b-9e6c-4dd8-8b51-f2efb77183f2	{"action":"token_refreshed","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-20 17:11:18.474027+00	
00000000-0000-0000-0000-000000000000	075fd508-3ec2-4e61-8419-d3f344e49871	{"action":"token_revoked","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-20 17:11:18.47478+00	
00000000-0000-0000-0000-000000000000	6b6f0102-55e8-4f3d-937b-0a1bd19eada6	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 17:11:34.268481+00	
00000000-0000-0000-0000-000000000000	23654b1e-5b0b-470b-89ec-a4379987a46b	{"action":"logout","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-06-20 17:11:58.46071+00	
00000000-0000-0000-0000-000000000000	cede7aec-1d69-4bfc-98d0-6184980de24e	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 17:12:01.526736+00	
00000000-0000-0000-0000-000000000000	1005b9c4-424d-4973-a0b4-c025c678b50d	{"action":"logout","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-06-20 17:12:40.546558+00	
00000000-0000-0000-0000-000000000000	4274081e-ee1f-4d61-ac5f-81a537f167b2	{"action":"user_repeated_signup","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-06-20 17:13:33.923799+00	
00000000-0000-0000-0000-000000000000	e9be9624-6e09-4dff-9a75-659c1aeb8a5c	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-20 17:13:42.587764+00	
00000000-0000-0000-0000-000000000000	49363df5-9199-412c-aa35-fdda2cc92f06	{"action":"login","actor_id":"7f5ea280-8bfe-4f37-9520-1675e43b4b9e","actor_name":"cicero silva","actor_username":"cicerosilva.ifce@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-06-20 17:29:09.846613+00	
00000000-0000-0000-0000-000000000000	89d683ae-1d6b-413e-b810-d29bbc74684f	{"action":"login","actor_id":"ba1fad66-1263-4884-a5d1-f42f912d385c","actor_name":"cicero","actor_username":"cicero.silva@ifce.edu.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-20 17:30:24.499453+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
ba1fad66-1263-4884-a5d1-f42f912d385c	ba1fad66-1263-4884-a5d1-f42f912d385c	{"sub": "ba1fad66-1263-4884-a5d1-f42f912d385c", "cargo": "Analista Administrativo", "email": "cicero.silva@ifce.edu.br", "full_name": "cicero", "matricula": "2231232", "email_verified": true, "phone_verified": false}	email	2025-05-22 17:45:31.884377+00	2025-05-22 17:45:31.884425+00	2025-05-22 17:45:31.884425+00	857f23ac-d633-4eb0-8014-01c392020ce5
106378680799167065265	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	{"iss": "https://accounts.google.com", "sub": "106378680799167065265", "name": "cicero silva", "email": "cicerosilva.ifce@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJxVFlPTwWG0A39mbY0_5gH2E7QT2aONQ00H89_OzfeOdnerDAm=s96-c", "full_name": "cicero silva", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJxVFlPTwWG0A39mbY0_5gH2E7QT2aONQ00H89_OzfeOdnerDAm=s96-c", "provider_id": "106378680799167065265", "email_verified": true, "phone_verified": false}	google	2025-05-21 19:38:31.702141+00	2025-05-21 19:38:31.702191+00	2025-06-20 17:29:09.842513+00	c90e18c3-c3ca-4ba6-b414-5fb132d49e80
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
c34d2d1b-6d45-4c7d-afbf-269c117d094a	2025-06-02 17:32:28.363251+00	2025-06-02 17:32:28.363251+00	password	51e65d93-929c-4c76-afdc-e1212a36cb67
1f32b3b7-8f6b-4d1e-aaa2-9a43112f7c3c	2025-06-02 17:54:20.465771+00	2025-06-02 17:54:20.465771+00	password	b1d6eb9f-483b-46a1-bc59-e42b1663506f
65ee972a-d82a-46f3-aa4f-f143bce1a841	2025-06-02 18:03:23.057853+00	2025-06-02 18:03:23.057853+00	password	ffe528fe-7e07-47f9-b6f0-53986d589087
f35ab22d-93ff-4166-b65e-523f7ca3a03c	2025-06-02 18:21:50.252442+00	2025-06-02 18:21:50.252442+00	password	4573702b-49e7-4880-9324-c9c24dab92ff
dc449f0b-f75d-4d2c-86be-7a90928f62dd	2025-06-02 18:32:17.435985+00	2025-06-02 18:32:17.435985+00	password	8c447853-8b9e-4418-a0c4-9039c5079b15
ad9fc8de-89b5-46af-9904-b3a299e8f630	2025-06-02 18:33:59.836038+00	2025-06-02 18:33:59.836038+00	password	d4f1f4e4-85ab-4c52-8772-59426f0c4968
3a2c631d-121b-40aa-a022-bbd4aa2486e2	2025-06-02 18:45:06.900023+00	2025-06-02 18:45:06.900023+00	password	eea5a207-4917-4f60-bddd-5f74ad3acdfb
dbefd4d1-8451-4462-af70-ed608c2d9dcd	2025-06-02 19:10:45.79302+00	2025-06-02 19:10:45.79302+00	password	4e0f9d5a-e82f-46e9-a815-1070f110d7ad
cadc8771-635d-47fc-bfaa-5821d649403f	2025-06-02 19:16:35.115258+00	2025-06-02 19:16:35.115258+00	password	9561832a-77de-4619-becc-c8467e7a5532
4cb68970-1174-4f95-9a54-d552dfd1f8d0	2025-06-20 17:13:42.59119+00	2025-06-20 17:13:42.59119+00	password	2a0eb082-c157-43ca-908b-b47c46e7b97f
ce2bac44-57ee-4c0a-afc5-c64c09cdb912	2025-06-20 17:29:09.850898+00	2025-06-20 17:29:09.850898+00	oauth	c04ce675-04e1-4690-aaff-53afa1da047e
298f683c-e638-411a-ac5e-8203821e8e00	2025-06-20 17:30:24.503651+00	2025-06-20 17:30:24.503651+00	password	2d31c206-868b-43b5-92e0-b176b040aab4
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	115	d526hbdoeiep	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 17:32:28.36215+00	2025-06-02 17:32:28.36215+00	\N	c34d2d1b-6d45-4c7d-afbf-269c117d094a
00000000-0000-0000-0000-000000000000	116	ntx4jr4snwdr	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 17:54:20.46143+00	2025-06-02 17:54:20.46143+00	\N	1f32b3b7-8f6b-4d1e-aaa2-9a43112f7c3c
00000000-0000-0000-0000-000000000000	117	vqj4qitcaz2i	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 18:03:23.054958+00	2025-06-02 18:03:23.054958+00	\N	65ee972a-d82a-46f3-aa4f-f143bce1a841
00000000-0000-0000-0000-000000000000	118	nmg3p5lilkz3	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 18:21:50.247656+00	2025-06-02 18:21:50.247656+00	\N	f35ab22d-93ff-4166-b65e-523f7ca3a03c
00000000-0000-0000-0000-000000000000	119	qb3bfpvr3bmd	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 18:32:17.433504+00	2025-06-02 18:32:17.433504+00	\N	dc449f0b-f75d-4d2c-86be-7a90928f62dd
00000000-0000-0000-0000-000000000000	120	m5bnb4vf4cyf	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 18:33:59.833394+00	2025-06-02 18:33:59.833394+00	\N	ad9fc8de-89b5-46af-9904-b3a299e8f630
00000000-0000-0000-0000-000000000000	121	htvqogntknib	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 18:45:06.893227+00	2025-06-02 18:45:06.893227+00	\N	3a2c631d-121b-40aa-a022-bbd4aa2486e2
00000000-0000-0000-0000-000000000000	122	yvydxvoywntx	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 19:10:45.788635+00	2025-06-02 19:10:45.788635+00	\N	dbefd4d1-8451-4462-af70-ed608c2d9dcd
00000000-0000-0000-0000-000000000000	123	jxndjxnlzhht	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-02 19:16:35.111629+00	2025-06-02 19:16:35.111629+00	\N	cadc8771-635d-47fc-bfaa-5821d649403f
00000000-0000-0000-0000-000000000000	135	ebns2a2wqiw7	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-20 17:13:42.590038+00	2025-06-20 17:13:42.590038+00	\N	4cb68970-1174-4f95-9a54-d552dfd1f8d0
00000000-0000-0000-0000-000000000000	136	rx3aqxn7vawl	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	f	2025-06-20 17:29:09.849143+00	2025-06-20 17:29:09.849143+00	\N	ce2bac44-57ee-4c0a-afc5-c64c09cdb912
00000000-0000-0000-0000-000000000000	137	riwbpyxftf54	ba1fad66-1263-4884-a5d1-f42f912d385c	f	2025-06-20 17:30:24.501647+00	2025-06-20 17:30:24.501647+00	\N	298f683c-e638-411a-ac5e-8203821e8e00
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
65ee972a-d82a-46f3-aa4f-f143bce1a841	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 18:03:23.05197+00	2025-06-02 18:03:23.05197+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0	200.17.32.208	\N
f35ab22d-93ff-4166-b65e-523f7ca3a03c	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 18:21:50.245228+00	2025-06-02 18:21:50.245228+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
dc449f0b-f75d-4d2c-86be-7a90928f62dd	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 18:32:17.431243+00	2025-06-02 18:32:17.431243+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0	200.17.32.208	\N
ad9fc8de-89b5-46af-9904-b3a299e8f630	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 18:33:59.832234+00	2025-06-02 18:33:59.832234+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
c34d2d1b-6d45-4c7d-afbf-269c117d094a	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 17:32:28.36151+00	2025-06-02 17:32:28.36151+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0	200.17.32.208	\N
1f32b3b7-8f6b-4d1e-aaa2-9a43112f7c3c	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 17:54:20.459211+00	2025-06-02 17:54:20.459211+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
3a2c631d-121b-40aa-a022-bbd4aa2486e2	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 18:45:06.891441+00	2025-06-02 18:45:06.891441+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
dbefd4d1-8451-4462-af70-ed608c2d9dcd	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 19:10:45.786137+00	2025-06-02 19:10:45.786137+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
cadc8771-635d-47fc-bfaa-5821d649403f	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-02 19:16:35.109218+00	2025-06-02 19:16:35.109218+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	200.17.32.208	\N
4cb68970-1174-4f95-9a54-d552dfd1f8d0	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-20 17:13:42.589263+00	2025-06-20 17:13:42.589263+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	189.36.205.83	\N
ce2bac44-57ee-4c0a-afc5-c64c09cdb912	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	2025-06-20 17:29:09.847438+00	2025-06-20 17:29:09.847438+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	189.36.205.83	\N
298f683c-e638-411a-ac5e-8203821e8e00	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-06-20 17:30:24.500562+00	2025-06-20 17:30:24.500562+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0	189.36.205.83	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	authenticated	authenticated	cicerosilva.ifce@gmail.com	\N	2025-05-21 19:38:31.711854+00	\N		2025-05-21 19:37:45.499439+00		\N			\N	2025-06-20 17:29:09.847366+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "106378680799167065265", "name": "cicero silva", "email": "cicerosilva.ifce@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJxVFlPTwWG0A39mbY0_5gH2E7QT2aONQ00H89_OzfeOdnerDAm=s96-c", "full_name": "cicero silva", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJxVFlPTwWG0A39mbY0_5gH2E7QT2aONQ00H89_OzfeOdnerDAm=s96-c", "provider_id": "106378680799167065265", "email_verified": true, "phone_verified": false}	\N	2025-05-21 19:37:45.480093+00	2025-06-20 17:29:09.850426+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ba1fad66-1263-4884-a5d1-f42f912d385c	authenticated	authenticated	cicero.silva@ifce.edu.br	$2a$10$8aXNOF.m6u10Foi..Gm.eOXBzpd63PhB1GAr9JJ38.l39/R4nZuLC	2025-05-22 17:46:03.633415+00	\N		2025-05-22 17:45:31.890252+00		\N			\N	2025-06-20 17:30:24.500484+00	{"provider": "email", "providers": ["email"]}	{"sub": "ba1fad66-1263-4884-a5d1-f42f912d385c", "cargo": "Analista Administrativo", "email": "cicero.silva@ifce.edu.br", "full_name": "cicero", "matricula": "2231232", "email_verified": true, "phone_verified": false}	\N	2025-05-22 17:45:31.874606+00	2025-06-20 17:30:24.502992+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: competences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.competences (id, category, title, type, points_per_unit, max_points, unit, validation_rules) FROM stdin;
CAT1-01	Administrativas	Fiscalização de contratos	MONTHS	0.10	100.00	meses	{"max": 24, "min": 1, "docs": ["portaria"], "integer": true}
CAT1-02	Administrativas	Gestão de convênios	MONTHS	0.20	100.00	meses	{"min": 6, "docs": ["portaria", "relatorio"], "multiple": 6}
CAT1-03	Administrativas	Comissões de corregedoria	EVENTS	2.50	100.00	comissões	{"min": 1, "docs": ["portaria"]}
CAT1-04	Administrativas	Processos licitatórios	EVENTS	1.00	100.00	processos	{"min": 1, "docs": ["portaria"]}
CAT1-05	Administrativas	Desenvolvimento institucional	HOURS	0.05	100.00	horas	{"max": 400, "min": 20, "docs": ["relatorio"]}
CAT1-06	Administrativas	Elaboração de editais	EVENTS	0.10	100.00	editais	{"min": 1, "docs": ["edital"]}
CAT1-07	Administrativas	Elaboração de notas técnicas	EVENTS	1.00	100.00	notas	{"min": 1, "docs": ["nota"]}
CAT1-08	Administrativas	Elogio profissional	EVENTS	1.00	100.00	elogios	{"min": 1, "docs": ["portaria"]}
CAT1-09	Administrativas	Organização de processo seletivo	EVENTS	1.00	100.00	processos	{"min": 1, "docs": ["portaria"]}
CAT1-10	Administrativas	Participação em comissão de políticas públicas	EVENTS	1.00	100.00	comissões	{"min": 1, "docs": ["portaria"]}
CAT1-11	Administrativas	Participação em comissões permanentes	EVENTS	1.00	100.00	comissões	{"min": 1, "docs": ["portaria"]}
CAT1-12	Administrativas	Participação em conselhos profissionais	EVENTS	0.50	100.00	conselhos	{"min": 1, "docs": ["portaria"]}
CAT1-13	Administrativas	Participação em brigadas de incêndio	MONTHS	0.05	100.00	meses	{"min": 1, "docs": ["certificado"]}
CAT1-14	Administrativas	Ações voluntárias	EVENTS	1.00	100.00	ações	{"min": 1, "docs": ["certificado"]}
CAT1-15	Administrativas	Participação em conselhos superiores	EVENTS	2.50	100.00	conselhos	{"min": 1, "docs": ["portaria"]}
CAT1-16	Administrativas	Representação institucional	EVENTS	1.00	100.00	representações	{"min": 1, "docs": ["portaria"]}
CAT1-17	Administrativas	Coordenação de comissões	EVENTS	2.50	100.00	comissões	{"min": 1, "docs": ["portaria"]}
CAT1-18	Administrativas	Exercício em cargo de direção	MONTHS	0.25	100.00	meses	{"min": 1, "docs": ["portaria"]}
CAT1-19	Administrativas	Exercício em função gratificada	MONTHS	0.10	100.00	meses	{"min": 1, "docs": ["portaria"]}
CAT1-20	Administrativas	Responsabilidade por setor	MONTHS	0.10	100.00	meses	{"min": 1, "docs": ["portaria"]}
CAT1-21	Administrativas	Substituição de função	MONTHS	0.25	100.00	meses	{"min": 1, "docs": ["portaria"]}
CAT1-22	Administrativas	Participação sindical	EVENTS	2.50	100.00	mandatos	{"min": 1, "docs": ["ata"]}
CAT2-01	Experiência	Tempo de serviço público	MONTHS	0.10	120.00	meses	{"min": 12, "docs": ["declaracao"], "multiple": 12}
CAT2-02	Experiência	Atuação em órgãos externos	MONTHS	0.05	100.00	meses	{"min": 6, "docs": ["declaracao"]}
CAT2-03	Experiência	Trabalho em organismos internacionais	YEARS	1.50	100.00	anos	{"min": 1, "docs": ["contrato"]}
CAT2-04	Experiência	Experiência no Ministério da Educação	MONTHS	0.05	99.00	meses	{"min": 6, "docs": ["declaracao"]}
CAT2-05	Experiência	Coordenação de equipes	MONTHS	0.15	100.00	meses	{"min": 1, "docs": ["portaria"]}
CAT2-06	Experiência	Gestão de crises institucionais	EVENTS	3.00	100.00	eventos	{"min": 1, "docs": ["relatorio"]}
CAT2-07	Experiência	Implementação de políticas públicas	EVENTS	2.00	100.00	políticas	{"min": 1, "docs": ["portaria"]}
CAT2-08	Experiência	Participação em escolas de governo	YEARS	0.50	100.00	anos	{"min": 1, "docs": ["certificado"]}
CAT2-09	Experiência	Atuação em agências reguladoras	YEARS	1.00	100.00	anos	{"min": 1, "docs": ["declaracao"]}
CAT2-10	Experiência	Consultoria técnica especializada	EVENTS	1.00	100.00	consultorias	{"min": 1, "docs": ["contrato"]}
CAT2-11	Experiência	Participação em programas governamentais	EVENTS	1.00	100.00	programas	{"min": 1, "docs": ["portaria"]}
CAT2-12	Experiência	Coordenação de fiscalização de concurso	EVENTS	0.50	100.00	concursos	{"min": 1, "docs": ["portaria"]}
CAT2-13	Experiência	Logística de concurso público	EVENTS	0.50	100.00	concursos	{"min": 1, "docs": ["declaracao"]}
CAT2-14	Experiência	Participação em conselho fiscal	EVENTS	2.50	100.00	mandatos	{"min": 1, "docs": ["ata"]}
CAT2-15	Experiência	Membro de comissão eleitoral	EVENTS	1.00	100.00	comissoes	{"min": 1, "docs": ["portaria"]}
CAT2-16	Experiência	Jurado em concursos	EVENTS	0.50	100.00	concursos	{"min": 1, "docs": ["portaria"]}
CAT2-17	Experiência	Membro de conselho profissional	EVENTS	0.50	100.00	mandatos	{"min": 1, "docs": ["ata"]}
CAT2-18	Experiência	Supervisão da carreira	YEARS	0.25	100.00	anos	{"min": 1, "docs": ["portaria"]}
CAT3-01	Formação	Certificação em LIBRAS	HOURS	0.20	100.00	horas	{"min": 20, "docs": ["certificado"], "certifier": ["MEC", "INES"]}
CAT3-02	Formação	Curso técnico	HOURS	0.10	100.00	horas	{"min": 40, "docs": ["diploma"], "certifier": ["SENAI", "SENAC"]}
CAT3-03	Formação	Pós-graduação lato sensu	CREDITS	0.50	100.00	créditos	{"min": 360, "docs": ["diploma"]}
CAT3-04	Formação	Certificação profissional	HOURS	0.15	100.00	horas	{"min": 50, "docs": ["certificado"]}
CAT3-05	Formação	Disciplinas isoladas de graduação	CREDITS	0.30	100.00	créditos	{"min": 4, "docs": ["historico"]}
CAT3-06	Formação	Proficiência em língua estrangeira	EVENTS	5.00	100.00	certificações	{"min": 1, "docs": ["certificado"], "tests": ["TOEFL", "IELTS"]}
CAT4-01	Produção	Artigo científico	EVENTS	1.50	100.00	artigos	{"min": 1, "docs": ["artigo"], "issn": true}
CAT4-02	Produção	Patente registrada	EVENTS	5.00	100.00	patentes	{"min": 1, "docs": ["certificado"], "inpi": true}
CAT4-03	Produção	Livro publicado	EVENTS	3.00	100.00	livros	{"min": 1, "docs": ["livro"], "isbn": true}
CAT4-04	Produção	Software desenvolvido	EVENTS	4.00	100.00	softwares	{"min": 1, "docs": ["codigo"], "repository": true}
CAT4-05	Produção	Capítulo de livro	EVENTS	1.00	100.00	capítulos	{"min": 1, "docs": ["livro"], "isbn": true}
CAT4-06	Produção	Projeto gráfico	EVENTS	2.00	100.00	projetos	{"min": 1, "docs": ["projeto"]}
CAT4-07	Produção	Edição de mídia técnica	EVENTS	1.00	100.00	edições	{"min": 1, "docs": ["midia"]}
CAT4-08	Produção	Edição de roteiros	EVENTS	0.50	100.00	roteiros	{"min": 1, "docs": ["roteiro"]}
CAT4-09	Produção	Revisão técnica de publicação	EVENTS	1.00	100.00	revisões	{"min": 1, "docs": ["publicacao"]}
CAT4-10	Produção	Liderança de grupo de pesquisa	EVENTS	2.50	100.00	grupos	{"min": 1, "docs": ["portaria"]}
CAT4-11	Produção	Avaliação de trabalhos acadêmicos	EVENTS	1.00	100.00	avaliações	{"min": 1, "docs": ["ata"]}
CAT4-12	Produção	Prêmio profissional	EVENTS	2.50	100.00	prêmios	{"min": 1, "docs": ["diploma"]}
CAT5-01	Eventos	Organização de seminário	EVENTS	1.00	100.00	eventos	{"min": 1, "docs": ["certificado"]}
CAT5-02	Eventos	Participação em congresso	HOURS	0.05	100.00	horas	{"min": 10, "docs": ["certificado"]}
CAT5-03	Eventos	Apresentação de trabalho	EVENTS	0.80	100.00	trabalhos	{"min": 1, "docs": ["programacao"]}
CAT5-04	Eventos	Coordenação de projeto	MONTHS	0.30	100.00	meses	{"min": 6, "docs": ["portaria"]}
CAT5-05	Eventos	Banca examinadora	EVENTS	0.50	100.00	bancas	{"min": 1, "docs": ["portaria"]}
CAT5-06	Eventos	Comissão organizadora	EVENTS	1.00	100.00	comissoes	{"min": 1, "docs": ["portaria"]}
CAT5-07	Eventos	Mediação de mesa redonda	EVENTS	0.50	100.00	mediacoes	{"min": 1, "docs": ["programacao"]}
CAT5-08	Eventos	Ministração de minicurso	HOURS	0.10	100.00	horas	{"min": 10, "docs": ["programacao"]}
CAT5-09	Eventos	Participação em feira	EVENTS	0.20	100.00	feiras	{"min": 1, "docs": ["certificado"]}
CAT5-10	Eventos	Organização de mostra cultural	EVENTS	1.00	100.00	mostras	{"min": 1, "docs": ["portaria"]}
CAT5-11	Eventos	Coordenação de implantação de unidade	EVENTS	2.50	100.00	unidades	{"min": 1, "docs": ["portaria"]}
CAT5-12	Eventos	Participação em projeto de pesquisa	MONTHS	0.20	100.00	meses	{"min": 6, "docs": ["relatorio"]}
CAT5-13	Eventos	Desenvolvimento de protótipo	EVENTS	2.50	100.00	protótipos	{"min": 1, "docs": ["relatorio"]}
CAT5-14	Eventos	Transferência de tecnologia	EVENTS	5.00	100.00	contratos	{"min": 1, "docs": ["contrato"]}
CAT5-15	Eventos	Projeto pedagógico de curso	EVENTS	2.50	100.00	projetos	{"min": 1, "docs": ["portaria"]}
CAT5-16	Eventos	Participação em evento filantrópico	EVENTS	0.50	100.00	eventos	{"min": 1, "docs": ["certificado"]}
CAT5-17	Eventos	Avaliação de projeto institucional	EVENTS	1.00	100.00	avaliações	{"min": 1, "docs": ["parecer"]}
CAT5-18	Eventos	Participação em conselho editorial	EVENTS	2.50	100.00	conselhos	{"min": 1, "docs": ["portaria"]}
CAT5-19	Eventos	Organização de competição esportiva	EVENTS	1.00	100.00	competições	{"min": 1, "docs": ["portaria"]}
CAT5-20	Eventos	Coordenação de atividade extensionista	MONTHS	0.20	100.00	meses	{"min": 6, "docs": ["portaria"]}
CAT6-01	Ensino	Orientação de estágio	EVENTS	0.50	100.00	orientações	{"min": 1, "docs": ["termo"]}
CAT6-02	Ensino	Preceptoria em residência	MONTHS	0.10	100.00	meses	{"min": 6, "docs": ["portaria"]}
CAT6-03	Ensino	Tutoria acadêmica	HOURS	0.02	100.00	horas	{"min": 10, "docs": ["relatorio"]}
CAT6-04	Ensino	Elaboração de material didático	EVENTS	0.70	100.00	materiais	{"min": 1, "docs": ["material"]}
CAT6-05	Ensino	Correção de provas	EVENTS	0.10	100.00	provas	{"min": 10, "docs": ["lista"]}
CAT6-06	Ensino	Avaliação de curso pelo INEP	EVENTS	2.50	100.00	avaliações	{"min": 1, "docs": ["portaria"]}
CAT6-07	Ensino	Elaboração de itens para concurso	EVENTS	1.00	100.00	itens	{"min": 5, "docs": ["lista"]}
CAT6-08	Ensino	Orientação de bolsista	MONTHS	0.05	100.00	meses	{"min": 6, "docs": ["termo"]}
CAT6-09	Ensino	Apoio a preceptoria	MONTHS	0.10	100.00	meses	{"min": 1, "docs": ["declaracao"]}
\.


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profile (id, email, name, idjob, job, profile, date_singin) FROM stdin;
ba1fad66-1263-4884-a5d1-f42f912d385c	cicero.silva@ifce.edu.br	cicero	\N	\N	\N	2025-05-26 03:26:06.8+00
7f5ea280-8bfe-4f37-9520-1675e43b4b9e	cicerosilva.ifce@gmail.com	cicero silva	\N	\N	\N	2025-05-26 19:03:06.045267+00
\.


--
-- Data for Name: user_rsc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rsc (id, user_id, competence_id, quantity, value, data_inicio, data_fim, date_awarded, data_atualizacao) FROM stdin;
1	ba1fad66-1263-4884-a5d1-f42f912d385c	CAT1-01	12	1.20	2024-01-01	2025-01-01	2025-06-02 18:04:35.179066+00	2025-06-02 18:04:35.179066+00
2	ba1fad66-1263-4884-a5d1-f42f912d385c	CAT2-18	8	2.00	2015-01-01	2025-01-01	2025-06-02 18:06:56.57797+00	2025-06-02 18:06:56.57797+00
3	ba1fad66-1263-4884-a5d1-f42f912d385c	CAT1-01	12	1.20	2024-01-01	2025-01-01	2025-06-02 19:17:46.220975+00	2025-06-02 19:17:46.220975+00
4	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	CAT1-19	24	2.40	2023-01-01	2025-01-01	2025-06-02 19:20:23.618462+00	2025-06-02 19:20:23.618462+00
5	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	CAT5-09	5	1.00	0001-10-01	2025-01-01	2025-06-02 19:20:54.384106+00	2025-06-02 19:20:54.384106+00
6	7f5ea280-8bfe-4f37-9520-1675e43b4b9e	CAT1-03	5	12.50	2025-06-01	2025-06-20	2025-06-20 04:47:07.774974+00	2025-06-20 04:47:07.774974+00
7	ba1fad66-1263-4884-a5d1-f42f912d385c	CAT2-17	3	1.50	2024-05-20	2025-06-20	2025-06-20 17:31:33.436732+00	2025-06-20 17:31:33.436732+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-05-17 20:27:03
20211116045059	2025-05-17 20:27:07
20211116050929	2025-05-17 20:27:11
20211116051442	2025-05-17 20:27:14
20211116212300	2025-05-17 20:27:18
20211116213355	2025-05-17 20:27:22
20211116213934	2025-05-17 20:27:25
20211116214523	2025-05-17 20:27:30
20211122062447	2025-05-17 20:27:33
20211124070109	2025-05-17 20:27:36
20211202204204	2025-05-17 20:27:40
20211202204605	2025-05-17 20:27:43
20211210212804	2025-05-17 20:27:54
20211228014915	2025-05-17 20:27:57
20220107221237	2025-05-17 20:28:00
20220228202821	2025-05-17 20:28:03
20220312004840	2025-05-17 20:28:07
20220603231003	2025-05-17 20:28:12
20220603232444	2025-05-17 20:28:15
20220615214548	2025-05-17 20:28:20
20220712093339	2025-05-17 20:28:23
20220908172859	2025-05-17 20:28:26
20220916233421	2025-05-17 20:28:29
20230119133233	2025-05-17 20:28:33
20230128025114	2025-05-17 20:28:37
20230128025212	2025-05-17 20:28:41
20230227211149	2025-05-17 20:28:44
20230228184745	2025-05-17 20:28:47
20230308225145	2025-05-17 20:28:51
20230328144023	2025-05-17 20:28:54
20231018144023	2025-05-17 20:28:58
20231204144023	2025-05-17 20:29:03
20231204144024	2025-05-17 20:29:07
20231204144025	2025-05-17 20:29:10
20240108234812	2025-05-17 20:29:13
20240109165339	2025-05-17 20:29:17
20240227174441	2025-05-17 20:29:23
20240311171622	2025-05-17 20:29:27
20240321100241	2025-05-17 20:29:35
20240401105812	2025-05-17 20:29:44
20240418121054	2025-05-17 20:29:49
20240523004032	2025-05-17 20:30:01
20240618124746	2025-05-17 20:30:04
20240801235015	2025-05-17 20:30:07
20240805133720	2025-05-17 20:30:11
20240827160934	2025-05-17 20:30:14
20240919163303	2025-05-17 20:30:19
20240919163305	2025-05-17 20:30:22
20241019105805	2025-05-17 20:30:25
20241030150047	2025-05-17 20:30:38
20241108114728	2025-05-17 20:30:43
20241121104152	2025-05-17 20:30:46
20241130184212	2025-05-17 20:30:50
20241220035512	2025-05-17 20:30:54
20241220123912	2025-05-17 20:30:57
20241224161212	2025-05-17 20:31:00
20250107150512	2025-05-17 20:31:04
20250110162412	2025-05-17 20:31:07
20250123174212	2025-05-17 20:31:10
20250128220012	2025-05-17 20:31:14
20250506224012	2025-05-22 18:45:06
20250523164012	2025-05-28 13:57:12
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
rscstorage	rscstorage	\N	2025-05-24 14:39:18.192688+00	2025-05-24 14:39:18.192688+00	t	f	\N	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-05-17 20:26:57.770112
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-05-17 20:26:57.773517
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-05-17 20:26:57.776227
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-05-17 20:26:57.793763
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-05-17 20:26:57.818
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-05-17 20:26:57.821134
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-05-17 20:26:57.824489
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-05-17 20:26:57.827752
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-05-17 20:26:57.830685
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-05-17 20:26:57.83352
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-05-17 20:26:57.836994
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-05-17 20:26:57.840923
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-05-17 20:26:57.844547
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-05-17 20:26:57.847893
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-05-17 20:26:57.851499
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-05-17 20:26:57.878633
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-05-17 20:26:57.882028
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-05-17 20:26:57.885074
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-05-17 20:26:57.888702
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-05-17 20:26:57.892827
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-05-17 20:26:57.902089
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-05-17 20:26:57.911336
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-05-17 20:26:57.939061
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-05-17 20:26:57.96534
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-05-17 20:26:57.96911
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-05-17 20:26:57.972228
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
22b1ac78-6f83-4058-9974-9fcdf50b6adb	rscstorage	documento_rsc/.emptyFolderPlaceholder	\N	2025-05-24 14:51:09.353545+00	2025-05-24 14:51:09.353545+00	2025-05-24 14:51:09.353545+00	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-05-24T14:51:10.000Z", "contentLength": 0, "httpStatusCode": 200}	d3e485d9-ceae-4471-a347-9da62f3a2e30	\N	{}
4248c75d-5219-42ea-86a3-2fa767656d13	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/9663423e-e38b-4662-ba92-c13b0422d1c9.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-25 04:47:19.672511+00	2025-05-25 04:47:19.672511+00	2025-05-25 04:47:19.672511+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-25T04:47:20.000Z", "contentLength": 90818, "httpStatusCode": 200}	e5c21477-ebb5-405e-9772-909caefbdcfe	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
78d1566f-8d8c-4198-84e1-8d12b8369b41	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/1312745b-4200-4afa-8c3c-f305da9db523.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:01:03.319508+00	2025-05-26 03:01:03.319508+00	2025-05-26 03:01:03.319508+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:01:04.000Z", "contentLength": 90818, "httpStatusCode": 200}	78a402ca-5b95-42a4-9970-12fce3396f2e	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
f135f005-e337-4199-8024-f874b80b43fa	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/183351c7-9a07-4214-84e1-589988d7c7c8.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:03:16.26798+00	2025-05-26 03:03:16.26798+00	2025-05-26 03:03:16.26798+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:03:17.000Z", "contentLength": 90818, "httpStatusCode": 200}	5842baeb-6c28-48c8-bae0-85d4dd2c57ac	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
974e1413-f34f-4f2e-92de-74afd3a397e2	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/8b3531f1-18b8-4026-b168-3d5418443411.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:17:19.9836+00	2025-05-26 03:17:19.9836+00	2025-05-26 03:17:19.9836+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:17:20.000Z", "contentLength": 90818, "httpStatusCode": 200}	50e73dca-8334-4479-9436-997c785fcd47	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
969eb8c2-4acd-4478-bb41-3f0cb9f3ea69	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/18b64bbc-7eea-4037-b396-b6a72cb807ce.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:18:08.812587+00	2025-05-26 03:18:08.812587+00	2025-05-26 03:18:08.812587+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:18:09.000Z", "contentLength": 90818, "httpStatusCode": 200}	5e2da97d-271d-426c-b829-2a007fb7cd66	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
b9ef23ed-2e10-4ca9-a645-0046d4e8e692	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/a525e195-828f-4f2c-b4c6-11d16e17f5dc.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:39:07.256611+00	2025-05-26 03:39:07.256611+00	2025-05-26 03:39:07.256611+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:39:08.000Z", "contentLength": 90818, "httpStatusCode": 200}	e27f1c18-344a-40cf-97e2-b9084b9314e0	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
d1d73f6b-057a-4039-8598-4c37e143c100	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/60827d16-c104-48c2-b50f-72c3436e1fe7.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:39:14.366511+00	2025-05-26 03:39:14.366511+00	2025-05-26 03:39:14.366511+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:39:15.000Z", "contentLength": 90818, "httpStatusCode": 200}	eb29b6c4-2e68-49ed-9987-5c6391351268	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
ec8f4255-809b-4c81-991f-dde6b3943072	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/5d5ce4f7-c13f-4eed-b452-0c24e499d86a.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:47:24.866427+00	2025-05-26 03:47:24.866427+00	2025-05-26 03:47:24.866427+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:47:25.000Z", "contentLength": 90818, "httpStatusCode": 200}	a6552347-97bb-4ff7-8b43-72f11ccee2da	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
e36aa653-8745-469d-9339-e9cbb2c67862	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/3818d0e2-3ca3-4252-b7f3-864d203605de.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 03:53:54.432185+00	2025-05-26 03:53:54.432185+00	2025-05-26 03:53:54.432185+00	{"eTag": "\\"c7bf58f6b6ef18961883919cc44588ae\\"", "size": 90818, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T03:53:55.000Z", "contentLength": 90818, "httpStatusCode": 200}	b552bac3-701f-4f17-b686-f5681607641f	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
bb37b528-a55b-44b1-889d-41d3bb93adfb	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/3a145a54-2590-4d24-94a5-a671b87137aa.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 14:21:29.203579+00	2025-05-26 14:21:29.203579+00	2025-05-26 14:21:29.203579+00	{"eTag": "\\"fc292fded49cd8664c5d88349d964193\\"", "size": 60644, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T14:21:30.000Z", "contentLength": 60644, "httpStatusCode": 200}	232235cf-d80c-4173-b364-18967eeba393	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
6da22b30-9a59-49b1-89a8-897fd01d5b3c	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/62b8be76-5a26-4487-9360-d3ade7cb8c85.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 14:29:34.256396+00	2025-05-26 14:29:34.256396+00	2025-05-26 14:29:34.256396+00	{"eTag": "\\"fc292fded49cd8664c5d88349d964193\\"", "size": 60644, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T14:29:35.000Z", "contentLength": 60644, "httpStatusCode": 200}	264f198a-189c-4aa6-923c-3dc93404e586	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
7573fa22-364d-4e91-9771-ea8ef6e14865	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/43163ecc-64ec-4c27-be51-22ef6f7c824b.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 14:46:38.65887+00	2025-05-26 14:46:38.65887+00	2025-05-26 14:46:38.65887+00	{"eTag": "\\"fc292fded49cd8664c5d88349d964193\\"", "size": 60644, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T14:46:39.000Z", "contentLength": 60644, "httpStatusCode": 200}	d0fbd3af-d456-4c38-9101-3d1150e51dfe	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
e873982b-afd6-4709-86c3-d850343a6b43	rscstorage	ba1fad66-1263-4884-a5d1-f42f912d385c/f38fdcf3-a452-47a5-9a30-34513e460d42.pdf	ba1fad66-1263-4884-a5d1-f42f912d385c	2025-05-26 15:04:20.499382+00	2025-05-26 15:04:20.499382+00	2025-05-26 15:04:20.499382+00	{"eTag": "\\"fc292fded49cd8664c5d88349d964193\\"", "size": 60644, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-05-26T15:04:21.000Z", "contentLength": 60644, "httpStatusCode": 200}	20487bc1-1e5a-49ce-b32b-fcd249c90c4f	ba1fad66-1263-4884-a5d1-f42f912d385c	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 137, true);


--
-- Name: user_rsc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_rsc_id_seq', 7, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: competences competences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competences
    ADD CONSTRAINT competences_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user_profile user_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_name_key UNIQUE (name);


--
-- Name: user_profile user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_rsc user_rsc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rsc
    ADD CONSTRAINT user_rsc_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_user_rsc_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_rsc_user_id ON public.user_rsc USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: user_profile set_user_fields_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_user_fields_before_insert BEFORE INSERT ON public.user_profile FOR EACH ROW EXECUTE FUNCTION public.set_user_fields_from_jwt();


--
-- Name: user_profile set_user_id_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_user_id_before_insert BEFORE INSERT ON public.user_profile FOR EACH ROW EXECUTE FUNCTION public.set_user_id_from_auth();


--
-- Name: user_rsc update_user_rsc_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_rsc_updated_at BEFORE UPDATE ON public.user_rsc FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: user_rsc user_rsc_competence_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rsc
    ADD CONSTRAINT user_rsc_competence_id_fkey FOREIGN KEY (competence_id) REFERENCES public.competences(id) ON DELETE CASCADE;


--
-- Name: user_rsc user_rsc_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rsc
    ADD CONSTRAINT user_rsc_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profile Allow authenticated users to create their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to create their own profile" ON public.user_profile FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: user_profile Allow authenticated users to update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to update their own profile" ON public.user_profile FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_profile Enable read access for own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for own profile" ON public.user_profile FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: competences Everyone can view competences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can view competences" ON public.competences FOR SELECT USING (true);


--
-- Name: user_rsc Users can delete own rsc records; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own rsc records" ON public.user_rsc FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_profile Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.user_profile FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: user_rsc Users can insert own rsc records; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own rsc records" ON public.user_rsc FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_profile Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.user_profile FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_rsc Users can update own rsc records; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own rsc records" ON public.user_rsc FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_profile Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.user_profile FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_rsc Users can view own rsc records; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own rsc records" ON public.user_rsc FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: competences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.competences ENABLE ROW LEVEL SECURITY;

--
-- Name: competences competences_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY competences_select_all ON public.competences FOR SELECT TO authenticated USING (true);


--
-- Name: competences delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY delete ON public.competences FOR DELETE TO authenticated USING (true);


--
-- Name: user_profile delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY delete ON public.user_profile FOR DELETE TO authenticated USING ((auth.uid() = id));


--
-- Name: competences insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY insert ON public.competences FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: user_profile insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY insert ON public.user_profile FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: competences select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.competences FOR SELECT TO authenticated USING (true);


--
-- Name: user_profile select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.user_profile FOR SELECT USING ((auth.uid() = id));


--
-- Name: competences update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY update ON public.competences FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: user_profile update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY update ON public.user_profile FOR UPDATE TO authenticated USING (true) WITH CHECK ((auth.uid() = id));


--
-- Name: user_profile; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

--
-- Name: user_rsc; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_rsc ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Allow authenticated users to delet their own files 8nsgl5_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to delet their own files 8nsgl5_0" ON storage.objects FOR DELETE USING (((bucket_id = 'rscstorage'::text) AND (auth.uid() = owner)));


--
-- Name: objects Allow authenticated users to inser their own files 8nsgl5_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to inser their own files 8nsgl5_0" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'rscstorage'::text) AND (auth.uid() = owner)));


--
-- Name: objects Allow authenticated users to read their own files 8nsgl5_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to read their own files 8nsgl5_0" ON storage.objects FOR SELECT USING (((bucket_id = 'rscstorage'::text) AND (auth.uid() = owner)));


--
-- Name: objects Allow authenticated users to updat their own files 8nsgl5_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to updat their own files 8nsgl5_0" ON storage.objects FOR UPDATE USING (((bucket_id = 'rscstorage'::text) AND (auth.uid() = owner)));


--
-- Name: buckets Enable read for authenticated users only; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Enable read for authenticated users only" ON storage.buckets FOR SELECT TO authenticated USING (true);


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime competences; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.competences;


--
-- Name: supabase_realtime user_profile; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.user_profile;


--
-- Name: supabase_realtime user_rsc; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.user_rsc;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION calculate_points(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_points() TO anon;
GRANT ALL ON FUNCTION public.calculate_points() TO authenticated;
GRANT ALL ON FUNCTION public.calculate_points() TO service_role;


--
-- Name: FUNCTION set_user_fields_from_jwt(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_user_fields_from_jwt() TO anon;
GRANT ALL ON FUNCTION public.set_user_fields_from_jwt() TO authenticated;
GRANT ALL ON FUNCTION public.set_user_fields_from_jwt() TO service_role;


--
-- Name: FUNCTION set_user_id_from_auth(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_user_id_from_auth() TO anon;
GRANT ALL ON FUNCTION public.set_user_id_from_auth() TO authenticated;
GRANT ALL ON FUNCTION public.set_user_id_from_auth() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION can_insert_object(bucketid text, name text, owner uuid, metadata jsonb); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) TO postgres;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: FUNCTION get_size_by_bucket(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.get_size_by_bucket() TO postgres;


--
-- Name: FUNCTION list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) TO postgres;


--
-- Name: FUNCTION list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) TO postgres;


--
-- Name: FUNCTION operation(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.operation() TO postgres;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) TO postgres;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.update_updated_at_column() TO postgres;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE competences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.competences TO anon;
GRANT ALL ON TABLE public.competences TO authenticated;
GRANT ALL ON TABLE public.competences TO service_role;


--
-- Name: TABLE user_profile; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_profile TO anon;
GRANT ALL ON TABLE public.user_profile TO authenticated;
GRANT ALL ON TABLE public.user_profile TO service_role;


--
-- Name: TABLE user_rsc; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_rsc TO anon;
GRANT ALL ON TABLE public.user_rsc TO authenticated;
GRANT ALL ON TABLE public.user_rsc TO service_role;


--
-- Name: SEQUENCE user_rsc_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_rsc_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_rsc_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_rsc_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads TO postgres;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO postgres;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--
