-- Create tables
CREATE TABLE influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  handle TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  numeric_price INTEGER NOT NULL,
  color TEXT,
  description TEXT NOT NULL,
  what_you_get TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(influencer_id, slug)
);

-- Create indexes
CREATE INDEX idx_influencers_slug ON influencers(slug);
CREATE INDEX idx_recommendations_slug ON recommendations(slug);
CREATE INDEX idx_recommendations_influencer_id ON recommendations(influencer_id);

-- Insert seed data
INSERT INTO influencers (slug, name, handle, profile_image) VALUES
  ('matt-smith', 'Matt Smith', '@adventuresbymatt', ''),
  ('jane-doe', 'Jane Doe', '@janedoetravels', '/placeholder.svg?height=120&width=120');

-- Insert recommendations for Matt Smith
INSERT INTO recommendations (slug, influencer_id, title, price, numeric_price, color, description, what_you_get, image)
SELECT 
  'pumpkin-space-craziness',
  id,
  'Pumpkin Space Craziness',
  'Free',
  0,
  'bg-[#97b5ec]',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Pellentesque urna ligula, tempus quis tristique vitae, dignissim quis nunc. Nunc tortor eros, eleifend lacinia nibh rhoncus, mattis tristique diam.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim.',
  '/placeholder.svg?height=400&width=700'
FROM influencers WHERE slug = 'matt-smith';

INSERT INTO recommendations (slug, influencer_id, title, price, numeric_price, color, description, what_you_get, image)
SELECT 
  'secret-beaches-of-dalmatia',
  id,
  'Secret beaches of Dalmatia',
  'Paid $3',
  3,
  'bg-[#7db48f]',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Pellentesque urna ligula, tempus quis tristique vitae, dignissim quis nunc. Nunc tortor eros, eleifend lacinia nibh rhoncus, mattis tristique diam.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim.',
  '/placeholder.svg?height=400&width=700'
FROM influencers WHERE slug = 'matt-smith';

INSERT INTO recommendations (slug, influencer_id, title, price, numeric_price, color, description, what_you_get, image)
SELECT 
  'coffee-in-east-berlin',
  id,
  'Coffee in East Berlin',
  'Premium $7',
  7,
  'bg-[#f7bdf6]',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Pellentesque urna ligula, tempus quis tristique vitae, dignissim quis nunc. Nunc tortor eros, eleifend lacinia nibh rhoncus, mattis tristique diam.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim.',
  '/placeholder.svg?height=400&width=700'
FROM influencers WHERE slug = 'matt-smith';

-- Insert recommendations for Jane Doe
INSERT INTO recommendations (slug, influencer_id, title, price, numeric_price, color, description, what_you_get, image)
SELECT 
  'hiking-in-switzerland',
  id,
  'Hiking in Switzerland',
  'Free',
  0,
  'bg-[#97b5ec]',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Pellentesque urna ligula, tempus quis tristique vitae, dignissim quis nunc. Nunc tortor eros, eleifend lacinia nibh rhoncus, mattis tristique diam.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim.',
  '/placeholder.svg?height=400&width=700'
FROM influencers WHERE slug = 'jane-doe';

INSERT INTO recommendations (slug, influencer_id, title, price, numeric_price, color, description, what_you_get, image)
SELECT 
  'paris-food-guide',
  id,
  'Paris Food Guide',
  'Paid $5',
  5,
  'bg-[#7db48f]',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Pellentesque urna ligula, tempus quis tristique vitae, dignissim quis nunc. Nunc tortor eros, eleifend lacinia nibh rhoncus, mattis tristique diam.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim.',
  '/placeholder.svg?height=400&width=700'
FROM influencers WHERE slug = 'jane-doe'; 