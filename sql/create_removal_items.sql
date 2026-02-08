-- Create removal_items table for storing furniture volume/weight data
-- Used by the auto-quote system to calculate moving quotes
DROP TABLE IF EXISTS removal_items;
CREATE TABLE IF NOT EXISTS removal_items (
  item_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  room TEXT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  volume_m3 NUMERIC(6,3) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
select * from removal_items;
-- Seed data from MWV removal_item_estimate.csv + frontend-specific items
INSERT INTO removal_items (item_id, name, room, weight_kg, volume_m3) VALUES
  -- Bedrooms
  ('single-bed', 'Single Bed & Mattress', 'Bedrooms', 30.00, 0.400),
  ('double-king-bed', 'Double Bed & Mattress', 'Bedrooms', 45.00, 0.550),
  ('kingsize-bed', 'Kingsize Bed & Mattress', 'Bedrooms', 55.00, 0.700),
  ('wardrobe', 'Single Wardrobe', 'Bedrooms', 30.00, 0.350),
  ('double-wardrobe', 'Double Wardrobe', 'Bedrooms', 50.00, 0.800),
  ('chest-of-drawers', 'Chest Of Drawers', 'Bedrooms', 30.00, 0.300),
  ('bedside-table', 'Bedside Table', 'Bedrooms', 8.00, 0.080),
  ('dressing-table', 'Dressing Table', 'Bedrooms', 25.00, 0.350),
  ('television', 'Television', 'Bedrooms', 5.00, 0.030),
  ('side-table', 'Side Table', 'Bedrooms', 6.00, 0.100),

  -- Living
  ('sofa-2-seater', 'Two Seater Sofa', 'Living', 40.00, 0.900),
  ('sofa-3-seater', 'Three Seater Sofa', 'Living', 55.00, 1.200),
  ('armchair', 'Armchair', 'Living', 25.00, 0.550),
  ('coffee-table', 'Coffee Table', 'Living', 15.00, 0.200),
  ('tv-small', 'Small Television/TV', 'Living', 5.00, 0.030),
  ('tv-large', 'Large Television/TV', 'Living', 15.00, 0.080),
  ('tv-stand', 'TV Stand', 'Living', 20.00, 0.200),
  ('bookcase', 'Bookcase', 'Living', 25.00, 0.400),
  ('rug', 'Rug', 'Living', 8.00, 0.080),
  ('desk', 'Desk', 'Living', 25.00, 0.450),
  ('office-chair', 'Office Chair', 'Living', 10.00, 0.300),
  ('artwork', 'Artwork', 'Living', 3.00, 0.030),
  ('floor-lamp', 'Floor Lamp', 'Living', 4.00, 0.040),

  -- Dining
  ('dining-table', '4 Seater Dining Table', 'Dining', 30.00, 0.450),
  ('dining-table-6', '6 Seater Dining Table', 'Dining', 45.00, 0.700),
  ('dining-chair', 'Dining Chair', 'Dining', 5.00, 0.120),
  ('sideboard', 'Sideboard', 'Dining', 35.00, 0.500),
  ('display-cabinet', 'Display Cabinet', 'Dining', 45.00, 0.650),

  -- Kitchen
  ('fridge-freezer', 'Fridge Freezer', 'Kitchen', 65.00, 0.550),
  ('washing-machine', 'Washing Machine', 'Kitchen', 75.00, 0.350),
  ('microwave', 'Microwave Oven', 'Kitchen', 12.00, 0.040),
  ('cooker-oven', 'Cooker', 'Kitchen', 50.00, 0.350),
  ('dishwasher', 'Dishwasher', 'Kitchen', 45.00, 0.350),
  ('kitchen-table', 'Kitchen Table', 'Kitchen', 25.00, 0.400),
  ('bin', 'Bin', 'Kitchen', 2.00, 0.040),
  ('ironing-board', 'Ironing Board', 'Kitchen', 4.00, 0.060),
  ('tumble-dryer', 'Tumble Dryer', 'Kitchen', 40.00, 0.350),

  -- Bathroom
  ('bathroom-mirror-large', 'Large Mirror', 'Bathroom', 10.00, 0.040),
  ('bathroom-mirror', 'Small Mirror', 'Bathroom', 3.00, 0.010),
  ('bathroom-rug', 'Rug', 'Bathroom', 3.00, 0.030),
  ('bathroom-cabinet', 'Bathroom Cabinet', 'Bathroom', 12.00, 0.100),
  ('bath-tub', 'Bath Tub', 'Bathroom', 25.00, 0.500),

  -- Garden
  ('garden-table', 'Garden Table', 'Garden', 12.00, 0.500),
  ('garden-chair', 'Garden Chair', 'Garden', 4.00, 0.120),
  ('lawn-mower', 'Lawn Mower', 'Garden', 15.00, 0.150),
  ('tool-box', 'Tool Box', 'Garden', 3.00, 0.020),
  ('bench', 'Bench', 'Garden', 18.00, 0.450),
  ('parasol', 'Parasol', 'Garden', 6.00, 0.100),
  ('bicycle', 'Bicycle', 'Garden', 12.00, 0.300),

  -- Garage
  ('tool-chest', 'Tool Chest', 'Garage', 20.00, 0.100),
  ('workbench', 'Workbench', 'Garage', 35.00, 0.600),
  ('shelving-unit', 'Shelving Unit', 'Garage', 18.00, 0.450),
  ('ladder', 'Ladder', 'Garage', 10.00, 0.100),
  ('garage-bicycle', 'Bicycle', 'Garage', 12.00, 0.300),
  ('motorcycle', 'Motorcycle', 'Garage', 180.00, 1.800),
  ('car-tyre-set', 'Car Tyre Set', 'Garage', 35.00, 0.300),
  ('garden-tools-set', 'Garden Tools Set', 'Garage', 8.00, 0.150),
  ('power-tools-box', 'Power Tools Box', 'Garage', 6.00, 0.040),
  ('storage-bin', 'Storage Bin', 'Garage', 2.00, 0.060),
  ('sports-equipment-rack', 'Sports Equipment Rack', 'Garage', 12.00, 0.400),
  ('spare-parts-box', 'Spare Parts Box', 'Garage', 4.00, 0.040),

  -- Boxes & Packaging
  ('small-box', 'Small Boxes', 'Boxes & Packaging', 0.50, 0.030),
  ('medium-box', 'Medium Boxes', 'Boxes & Packaging', 0.75, 0.055),
  ('large-box', 'Large Boxes', 'Boxes & Packaging', 1.00, 0.080),
  ('wardrobe-box', 'Wardrobe Boxes', 'Boxes & Packaging', 1.50, 0.120),

  -- Frontend-only items (not in CSV, estimated values)
  ('coffee-side-table', 'Coffee/Side Table', 'Living', 10.00, 0.150),
  ('suitcase', 'Suitcase', 'Boxes & Packaging', 3.00, 0.080),
  ('bag', 'Bag', 'Boxes & Packaging', 1.00, 0.040),
  ('monitor', 'Monitor', 'Living', 6.00, 0.040)

ON CONFLICT (item_id) DO UPDATE SET
  name = EXCLUDED.name,
  room = EXCLUDED.room,
  weight_kg = EXCLUDED.weight_kg,
  volume_m3 = EXCLUDED.volume_m3,
  is_active = TRUE;
