CREATE TABLE user_emails (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  is_verified INTEGER NOT NULL DEFAULT 0 CHECK (is_verified IN (0, 1)),
  verified_at_ms INTEGER,
  source TEXT NOT NULL CHECK (source IN ('password', 'github', 'google', 'manual')),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_emails_normalized_email_unique
ON user_emails(normalized_email);

CREATE UNIQUE INDEX idx_user_emails_user_normalized_unique
ON user_emails(user_id, normalized_email);

CREATE UNIQUE INDEX idx_user_emails_one_primary_per_user
ON user_emails(user_id)
WHERE is_primary = 1;