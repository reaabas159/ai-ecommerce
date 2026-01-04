import database from "../database/db.js";
import { createUserTable } from "../models/userTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createProductsTable } from "../models/productTable.js";
import { createShippingInfoTable } from "../models/shippinginfoTable.js";

export const createTables = async () => {
  try {
    // 1. Independent Tables
    await createUserTable();
    await createProductsTable();

    // 2. Tables with dependencies
    await createProductReviewsTable(); // Depends on Users & Products
    await createOrdersTable();         // Depends on Users
    
    // 3. Deep dependencies
    await createOrderItemTable();      // Depends on Orders & Products
    await createShippingInfoTable();   // Depends on Orders
    await createPaymentsTable();       // Depends on Orders

    // Create Stored Procedure for Transactions
    // This function handles the "Place Order" logic atomically in the DB.
    await createOrderTransactionProcedure();

    console.log(" All Tables, Triggers, and Procedures Created Successfully.");
  } catch (error) {
    console.error(" Error creating tables:", error);
  }
};

//  --- STORED PROCEDURE FOR TRANSACTIONS ---
async function createOrderTransactionProcedure() {
  const query = `
    CREATE OR REPLACE FUNCTION place_order_transaction(
        p_buyer_id UUID,
        p_shipping_address JSONB,
        p_payment_info JSONB,
        p_total_price DECIMAL,
        p_tax_price DECIMAL,
        p_shipping_price DECIMAL,
        p_order_items JSONB
    ) RETURNS UUID AS $$
    DECLARE
        v_order_id UUID;
        v_item JSONB;
    BEGIN
        -- 1. Insert Order
        INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price, order_status, paid_at)
        VALUES (p_buyer_id, p_total_price, p_tax_price, p_shipping_price, 'Processing', NOW())
        RETURNING id INTO v_order_id;

        -- 2. Insert Shipping Info
        INSERT INTO shipping_info (order_id, address, city, state, country, pincode, phone_no)
        VALUES (
            v_order_id,
            p_shipping_address->>'address',
            p_shipping_address->>'city',
            p_shipping_address->>'state',
            p_shipping_address->>'country',
            p_shipping_address->>'pinCode',
            p_shipping_address->>'phoneNo'
        );

        -- 3. Insert Payment Info
        INSERT INTO payments (order_id, payment_id, status)
        VALUES (
            v_order_id,
            p_payment_info->>'id',
            p_payment_info->>'status'
        );

        -- 4. Loop through items and Insert Order Items + Update Stock
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
        LOOP
            INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
            VALUES (
                v_order_id,
                (v_item->>'product')::UUID,
                v_item->>'name',
                (v_item->>'price')::DECIMAL,
                (v_item->>'quantity')::INT,
                v_item->>'image'
            );

            -- Automation: Decrease Product Stock
            UPDATE products 
            SET stock = stock - (v_item->>'quantity')::INT
            WHERE id = (v_item->>'product')::UUID;
        END LOOP;

        RETURN v_order_id;
    END;
    $$ LANGUAGE plpgsql;
  `;
  await database.query(query);
}