CREATE TABLE users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  username text not null,
  email text UNIQUE
);
