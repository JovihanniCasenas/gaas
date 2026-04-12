CREATE TABLE stations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  location extensions.geography(POINT) not null,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

CREATE TABLE saved_stations (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, station_id)
);

CREATE INDEX stations_geo_index
  ON public.stations
  USING GIST (location);

CREATE OR REPLACE FUNCTION nearby_stations(lat float, lng float, radius_m float)
RETURNS setof stations AS $$
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
$$ language sql stable;
