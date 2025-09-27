/*
  # Add order_index column to subtasks table

  1. Changes
    - Add `order_index` column to `subtasks` table with default value 0
    - Update existing subtasks to have proper order based on creation time
    - Add index for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add the order_index column with default value
ALTER TABLE subtasks ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- Update existing subtasks to have proper order based on creation time
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM subtasks WHERE order_index = 0) THEN
    WITH ordered_subtasks AS (
      SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY parent_task_id ORDER BY created_at) - 1 as new_order
      FROM subtasks
      WHERE order_index = 0
    )
    UPDATE subtasks 
    SET order_index = ordered_subtasks.new_order
    FROM ordered_subtasks
    WHERE subtasks.id = ordered_subtasks.id;
  END IF;
END $$;

-- Add index for better performance on order queries
CREATE INDEX IF NOT EXISTS subtasks_order_idx ON subtasks (parent_task_id, order_index);