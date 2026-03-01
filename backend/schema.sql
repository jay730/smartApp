-- Manual schema for SmartApp (PostgreSQL)

CREATE TABLE IF NOT EXISTS residents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dateOfBirth DATE,
  roomNumber TEXT,
  fileRefs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  assignedResidents INTEGER[],
  fileRefs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assignedTo INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  assignedBy INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  residentId INTEGER REFERENCES residents(id) ON DELETE SET NULL,
  dueDate DATE,
  completedAt TIMESTAMP,
  category TEXT DEFAULT 'other',
  tags JSONB,
  fileRefs JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
