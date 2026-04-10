create extension if not exists "postgis" with schema "extensions";

drop view if exists "public"."prices_with_votes";

alter table "public"."stations" alter column "location" set not null;

alter table "public"."stations" alter column "location" set data type extensions.geography(Point,4326) using "location"::extensions.geography(Point,4326);

CREATE INDEX stations_geo_index ON public.stations USING gist (location);

create or replace view "public"."prices_with_votes" as  SELECT p.id,
    p.amount,
    p.fuel_type,
    p.currency,
    p.description,
    p.image_url,
    p.station_id,
    p.created_by,
    p.created_at,
    p.updated_at,
    count(v.id) FILTER (WHERE (v.vote_type = 'upvote'::text)) AS upvotes,
    count(v.id) FILTER (WHERE (v.vote_type = 'downvote'::text)) AS downvotes
   FROM (public.prices p
     LEFT JOIN public.votes v ON ((v.price_id = p.id)))
  GROUP BY p.id;



