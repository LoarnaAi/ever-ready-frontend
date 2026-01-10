-- -- Create table everreadyai_removals with all form fields
-- CREATE TABLE everreadyai_removals (
-- 	id SERIAL PRIMARY KEY,
	
-- 	-- Step 1: Move Type
-- 	move_type VARCHAR(50) NOT NULL,
	
-- 	-- Step 2: Quote Form
-- 	type_of_move VARCHAR(50) NOT NULL DEFAULT 'Removals',
-- 	moving_area VARCHAR(50) NOT NULL DEFAULT 'Domestic',
-- 	preferred_date DATE,
-- 	flexible_dates VARCHAR(50) DEFAULT '± 1 week',
	
-- 	-- Step 3: Current Home
-- 	current_postcode VARCHAR(20),
-- 	current_address TEXT,
-- 	current_property_type VARCHAR(50),
-- 	current_has_lift VARCHAR(10),
-- 	current_rooms JSONB, -- Store room data as JSON
	
-- 	-- Step 4: Moving To
-- 	new_postcode VARCHAR(20),
-- 	new_address TEXT,
-- 	new_property_type VARCHAR(50),
-- 	new_has_lift VARCHAR(10),
	
-- 	-- Step 5: Additional Info
-- 	heavy_items VARCHAR(10) DEFAULT 'No',
-- 	fragile_items VARCHAR(10) DEFAULT 'No',
-- 	additional_services JSONB, -- Store array of services as JSON
-- 	comment TEXT,
	
-- 	-- Step 6: Contact Info
-- 	first_name VARCHAR(100) NOT NULL,
-- 	last_name VARCHAR(100) NOT NULL,
-- 	email VARCHAR(255) NOT NULL,
-- 	phone VARCHAR(20),
	
-- 	-- Metadata
-- 	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- 	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create index for better query performance
-- CREATE INDEX idx_everreadyai_removals_email ON everreadyai_removals(email);
-- CREATE INDEX idx_everreadyai_removals_created_at ON everreadyai_removals(created_at);
-- CREATE INDEX idx_everreadyai_removals_move_type ON everreadyai_removals(move_type);

-- DELETE FROM everreadyai_removals WHERE id IN (2, 3);

-- INSERT INTO everreadyai_removals (
--   id, move_type, type_of_move, moving_area, preferred_date, flexible_dates,
--   current_postcode, current_address, current_property_type, current_has_lift, current_rooms,
--   new_postcode, new_address, new_property_type, new_has_lift,
--   heavy_items, fragile_items, additional_services, comment,
--   first_name, last_name, email, phone
-- ) VALUES (
--   1, 'Local', 'Removals', 'Domestic', '2025-10-01', '± 1 week',
--   '12345', '123 Main St', 'Apartment', 'Yes', '{"bedroom":2,"kitchen":1}',
--   '54321', '456 Elm St', 'House', 'No',
--   'No', 'No', '[]', 'No comments',
--   'John', 'Doe', 'john@example.com', '1234567890'
-- );

SELECT * FROM everreadyai_removals;

-- DELETE FROM everreadyai_removals WHERE id = 1;

