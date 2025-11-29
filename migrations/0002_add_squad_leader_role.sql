-- Add squad_leader role to user_role enum
-- Note: PostgreSQL doesn't support IF NOT EXISTS for ALTER TYPE ADD VALUE
-- This migration will fail if the value already exists, which is expected behavior

-- Add squad_leader value to user_role enum
-- The value will be added after 'user' in the enum order
ALTER TYPE "user_role" ADD VALUE 'squad_leader';

