-- Add locale column to trials table for i18n support
-- Historical rows default to 'en', preserving existing English content as-is
ALTER TABLE trials ADD COLUMN locale TEXT NOT NULL DEFAULT 'en';
