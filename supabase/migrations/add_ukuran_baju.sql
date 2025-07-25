-- Add ukuran_baju field to registrations table
USE kebonkito_trailrun;

ALTER TABLE registrations ADD COLUMN ukuran_baju VARCHAR(10) AFTER payment_status; 