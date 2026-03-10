-- Kathmandu seed spots for NomadWifi
insert into spots (name, description, lat, lng, wifi_speed, power_backup, city, country)
values
  ('Himalayan Java', 'Popular coffee chain with reliable wifi and a cozy atmosphere.', 27.7172, 85.3240, 'fast', true, 'Kathmandu', 'Nepal'),
  ('Moksh Cafe', 'Chill rooftop cafe with good wifi and power outlets.', 27.7195, 85.3110, 'medium', true, 'Kathmandu', 'Nepal'),
  ('OR2K Restaurant', 'Thamel classic with free wifi and a laid-back vibe.', 27.7089, 85.3156, 'medium', false, 'Kathmandu', 'Nepal'),
  ('Roadhouse Cafe', 'Busy spot popular with expats — solid wifi throughout.', 27.7223, 85.3182, 'fast', true, 'Kathmandu', 'Nepal'),
  ('Coffee Toffee', 'Local chain with fast wifi and ample seating.', 27.7055, 85.3280, 'fast', false, 'Kathmandu', 'Nepal');
