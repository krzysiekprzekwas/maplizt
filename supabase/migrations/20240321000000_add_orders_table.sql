-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  card_number TEXT,
  card_expiry TEXT,
  card_cvc TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_orders_recommendation_id ON orders(recommendation_id);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status); 