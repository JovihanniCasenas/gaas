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



