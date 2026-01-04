import database from "../database/db.js";

export async function createProductReviewsTable() {
  try {
    const query = `CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating DECIMAL(3,2) NOT NULL CHECK (rating BETWEEN 0 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`;
    
    await database.query(query);

    // Indexes
    await database.query(`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);`);

    // --- TRIGGER FUNCTION ---
    // Automatically update product average rating when a review is added/deleted
    await database.query(`
      CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
      BEGIN
        UPDATE products
        SET ratings = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
        WHERE id = COALESCE(NEW.product_id, OLD.product_id);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await database.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_rating') THEN
          CREATE TRIGGER trigger_update_rating
          AFTER INSERT OR UPDATE OR DELETE ON reviews
          FOR EACH ROW
          EXECUTE FUNCTION update_product_rating();
        END IF;
      END $$;
    `);

  } catch (error) {
    console.error("Failed To Create Products Reviews Table.", error);
    process.exit(1);
  }
}