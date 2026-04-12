drop view if exists "public"."prices_with_votes";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_stations(lat double precision, lng double precision, radius_m double precision)
 RETURNS SETOF public.stations
 LANGUAGE sql
 STABLE
AS $function$
  SELECT * FROM stations
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::extensions.geography,
    radius_m
  )
  ORDER BY ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::extensions.geography
  )
$function$
;

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



