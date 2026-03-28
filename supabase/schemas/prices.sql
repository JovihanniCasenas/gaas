CREATE TABLE prices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  amount decimal(10,3) NOT NULL,
  fuel_type text NOT NULL,
  currency text NOT NULL,
  description text,
  image_url text,
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_type text CHECK (vote_type IN ('upvote', 'downvote')),
  user_id uuid REFERENCES users(id),
  price_id uuid REFERENCES prices(id) ON DELETE CASCADE,
  UNIQUE(user_id, price_id) -- Prevents double voting
);

CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  user_id uuid REFERENCES users(id),
  price_id uuid REFERENCES prices(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE VIEW prices_with_votes AS
SELECT
  p.*,
  COUNT(v.id) FILTER (WHERE v.vote_type = 'upvote')   AS upvotes,
  COUNT(v.id) FILTER (WHERE v.vote_type = 'downvote') AS downvotes
FROM prices p
LEFT JOIN votes v ON v.price_id = p.id
GROUP BY p.id;