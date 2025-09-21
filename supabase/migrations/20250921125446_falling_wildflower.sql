/*
  # Add order column to subtasks table

  1. Changes
    - Add `order_index` column to subtasks table for drag-and-drop ordering
    - Set default values for existing subtasks
    - Add index for better query performance

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subtasks' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE subtasks ADD COLUMN order_index integer DEFAULT 0;
    
    -- Set order_index for existing subtasks based on created_at
    UPDATE subtasks 
    SET order_index = row_number() OVER (PARTITION BY parent_task_id ORDER BY created_at) - 1;
    
    -- Add index for better performance
    CREATE INDEX IF NOT EXISTS subtasks_order_idx ON subtasks (parent_task_id, order_index);
  END IF;
END $$;