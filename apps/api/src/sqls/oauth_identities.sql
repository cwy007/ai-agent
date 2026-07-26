CREATE TABLE oauth_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'google')),
  provider_subject TEXT NOT NULL,
  email_id TEXT,
  provider_username TEXT,
  provider_email TEXT,
  profile_snapshot TEXT,
  linked_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER,
  unlinked_at_ms INTEGER,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (email_id) REFERENCES user_emails(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_oauth_identities_provider_subject_unique
ON oauth_identities(provider, provider_subject);
