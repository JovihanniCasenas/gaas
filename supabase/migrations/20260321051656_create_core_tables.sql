create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "content" text not null,
    "user_id" uuid,
    "price_id" uuid,
    "created_at" timestamp with time zone default now()
);


create table "public"."prices" (
    "id" uuid not null default gen_random_uuid(),
    "amount" numeric(10,3) not null,
    "image_url" text,
    "station_id" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone default now()
);


create table "public"."saved_stations" (
    "user_id" uuid not null,
    "station_id" uuid not null
);


create table "public"."stations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "location" text,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid
);


create table "public"."users" (
    "id" uuid not null,
    "username" text not null,
    "email" text
);


create table "public"."votes" (
    "id" uuid not null default gen_random_uuid(),
    "vote_type" text,
    "user_id" uuid,
    "price_id" uuid
);


CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX saved_stations_pkey ON public.saved_stations USING btree (user_id, station_id);

CREATE UNIQUE INDEX stations_pkey ON public.stations USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

CREATE UNIQUE INDEX votes_user_id_price_id_key ON public.votes USING btree (user_id, price_id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."saved_stations" add constraint "saved_stations_pkey" PRIMARY KEY using index "saved_stations_pkey";

alter table "public"."stations" add constraint "stations_pkey" PRIMARY KEY using index "stations_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."comments" add constraint "comments_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_price_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."prices" add constraint "prices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) not valid;

alter table "public"."prices" validate constraint "prices_created_by_fkey";

alter table "public"."prices" add constraint "prices_station_id_fkey" FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_station_id_fkey";

alter table "public"."saved_stations" add constraint "saved_stations_station_id_fkey" FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE not valid;

alter table "public"."saved_stations" validate constraint "saved_stations_station_id_fkey";

alter table "public"."saved_stations" add constraint "saved_stations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."saved_stations" validate constraint "saved_stations_user_id_fkey";

alter table "public"."stations" add constraint "stations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) not valid;

alter table "public"."stations" validate constraint "stations_created_by_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."votes" add constraint "votes_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_price_id_fkey";

alter table "public"."votes" add constraint "votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."votes" validate constraint "votes_user_id_fkey";

alter table "public"."votes" add constraint "votes_user_id_price_id_key" UNIQUE using index "votes_user_id_price_id_key";

alter table "public"."votes" add constraint "votes_vote_type_check" CHECK ((vote_type = ANY (ARRAY['upvote'::text, 'downvote'::text]))) not valid;

alter table "public"."votes" validate constraint "votes_vote_type_check";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."saved_stations" to "anon";

grant insert on table "public"."saved_stations" to "anon";

grant references on table "public"."saved_stations" to "anon";

grant select on table "public"."saved_stations" to "anon";

grant trigger on table "public"."saved_stations" to "anon";

grant truncate on table "public"."saved_stations" to "anon";

grant update on table "public"."saved_stations" to "anon";

grant delete on table "public"."saved_stations" to "authenticated";

grant insert on table "public"."saved_stations" to "authenticated";

grant references on table "public"."saved_stations" to "authenticated";

grant select on table "public"."saved_stations" to "authenticated";

grant trigger on table "public"."saved_stations" to "authenticated";

grant truncate on table "public"."saved_stations" to "authenticated";

grant update on table "public"."saved_stations" to "authenticated";

grant delete on table "public"."saved_stations" to "service_role";

grant insert on table "public"."saved_stations" to "service_role";

grant references on table "public"."saved_stations" to "service_role";

grant select on table "public"."saved_stations" to "service_role";

grant trigger on table "public"."saved_stations" to "service_role";

grant truncate on table "public"."saved_stations" to "service_role";

grant update on table "public"."saved_stations" to "service_role";

grant delete on table "public"."stations" to "anon";

grant insert on table "public"."stations" to "anon";

grant references on table "public"."stations" to "anon";

grant select on table "public"."stations" to "anon";

grant trigger on table "public"."stations" to "anon";

grant truncate on table "public"."stations" to "anon";

grant update on table "public"."stations" to "anon";

grant delete on table "public"."stations" to "authenticated";

grant insert on table "public"."stations" to "authenticated";

grant references on table "public"."stations" to "authenticated";

grant select on table "public"."stations" to "authenticated";

grant trigger on table "public"."stations" to "authenticated";

grant truncate on table "public"."stations" to "authenticated";

grant update on table "public"."stations" to "authenticated";

grant delete on table "public"."stations" to "service_role";

grant insert on table "public"."stations" to "service_role";

grant references on table "public"."stations" to "service_role";

grant select on table "public"."stations" to "service_role";

grant trigger on table "public"."stations" to "service_role";

grant truncate on table "public"."stations" to "service_role";

grant update on table "public"."stations" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";


