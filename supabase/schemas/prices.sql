CREATE TABLE prices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  amount decimal(10,3) NOT NULL,
  fuel_type text NOT NULL,
  image_url text,
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
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
  created_at timestamptz DEFAULT now()
);