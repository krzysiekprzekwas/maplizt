-- Add view_count column to recommendations table
ALTER TABLE recommendations
ADD COLUMN view_count INTEGER DEFAULT 0;

-- Create a function to increment view count
CREATE OR REPLACE FUNCTION increment_recommendation_view_count(recommendation_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE recommendations
  SET view_count = view_count + 1
  WHERE id = recommendation_id;
END;
$$ LANGUAGE plpgsql; 