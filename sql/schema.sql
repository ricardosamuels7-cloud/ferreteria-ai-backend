CREATE TABLE retailers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE retailer_users (
  id SERIAL PRIMARY KEY,
  retailer_id INT NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  retailer_id INT NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  store_id INT,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CRC',
  stock INT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (retailer_id, sku)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INT,
  description TEXT NOT NULL,
  project_type TEXT,
  location_text TEXT,
  bom_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer_id INT NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  review_text TEXT,
  images_json JSONB DEFAULT '[]'::jsonb,
  verified_purchase BOOLEAN DEFAULT FALSE,
  sentiment TEXT,
  sentiment_score NUMERIC(4,3),
  retailer_reply TEXT,
  retailer_reply_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_rating_summary (
  product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  last_update TIMESTAMP NOT NULL DEFAULT NOW()
);
