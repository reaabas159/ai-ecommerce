import database from "../database/db.js";

export async function createUserTable() {
  try {
    // 1. Enable Encryption Extension 
    await database.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // 2. Create Trigger Function for Automation 
    await database.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 3),
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL, -- Storing Bcrypt hash (Professor Rule #4)
            role VARCHAR(10) DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
            avatar JSONB DEFAULT NULL,
            reset_password_token TEXT DEFAULT NULL,
            reset_password_expire TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await database.query(query);

    // 3. Create Index for Optimization 
    await database.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

    // 4. Attach Trigger to Table
    await database.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_modtime') THEN
          CREATE TRIGGER update_users_modtime
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$;
    `);

    // 5. Enable Row Level Security 
    await database.query(`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`);

  } catch (error) {
    console.error(" Failed To Create Users Table.", error);
    process.exit(1);
  }
}