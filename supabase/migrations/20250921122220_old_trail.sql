/*
  # Add subtasks table and AI functionality

  1. New Tables
    - `subtasks`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `parent_task_id` (uuid, foreign key to tasks)
      - `user_id` (uuid, foreign key to auth.users)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subtasks` table
    - Add policies for authenticated users to manage their own subtasks

  3. Changes
    - Add foreign key constraints
    - Add indexes for performance
*/

CREATE TABLE IF NOT EXISTS subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  parent_task_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'done')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints
ALTER TABLE subtasks 
ADD CONSTRAINT subtasks_parent_task_id_fkey 
FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE subtasks 
ADD CONSTRAINT subtasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS subtasks_parent_task_id_idx ON subtasks(parent_task_id);
CREATE INDEX IF NOT EXISTS subtasks_user_id_idx ON subtasks(user_id);
CREATE INDEX IF NOT EXISTS subtasks_status_idx ON subtasks(status);

-- RLS Policies
CREATE POLICY "Users can read own subtasks"
  ON subtasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subtasks"
  ON subtasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subtasks"
  ON subtasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subtasks"
  ON subtasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);