CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('full-time', 'part-time', 'freelance', 'internship')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_employer ON jobs (employer_id);
CREATE INDEX idx_jobs_category ON jobs (category_id);
CREATE INDEX idx_jobs_status ON jobs (status);