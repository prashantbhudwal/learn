import type { Database } from 'bun:sqlite'

export function seedData(db: Database): void {
  // Categories
  const categories = [
    ['Electronics', 'Gadgets and electronic devices'],
    ['Clothing', 'Apparel and accessories'],
    ['Books', 'Physical and digital books'],
    ['Home', 'Home and garden products'],
  ]

  const catStmt = db.prepare(
    'INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)',
  )
  for (const cat of categories) {
    catStmt.run(...cat)
  }

  // Products (16 products across 4 categories)
  const products = [
    // Electronics (5 products)
    ['Laptop', 1, 999.99, 50],
    ['Smartphone', 1, 699.99, 100],
    ['Headphones', 1, 199.99, 200],
    ['Wireless Mouse', 1, 29.99, 300],
    ['Mechanical Keyboard', 1, 149.99, 80],
    // Clothing (5 products)
    ['T-Shirt', 2, 29.99, 500],
    ['Jeans', 2, 79.99, 300],
    ['Jacket', 2, 149.99, 150],
    ['Running Shoes', 2, 89.99, 200],
    ['Hoodie', 2, 59.99, 250],
    // Books (3 products)
    ['SQL Mastery', 3, 49.99, 1000],
    ['JavaScript Guide', 3, 39.99, 800],
    ['Python for Data Science', 3, 54.99, 600],
    // Home (3 products)
    ['Coffee Maker', 4, 89.99, 75],
    ['Desk Lamp', 4, 45.99, 120],
    ['Air Purifier', 4, 199.99, 40],
  ]

  const prodStmt = db.prepare(
    'INSERT OR IGNORE INTO products (name, category_id, price, stock) VALUES (?, ?, ?, ?)',
  )
  for (const prod of products) {
    prodStmt.run(...prod)
  }

  // Users (10 users)
  const users = [
    ['alice@example.com', 'Alice', 'Johnson'],
    ['bob@example.com', 'Bob', 'Smith'],
    ['carol@example.com', 'Carol', 'Williams'],
    ['dave@example.com', 'Dave', 'Brown'],
    ['eve@example.com', 'Eve', 'Davis'],
    ['frank@example.com', 'Frank', 'Miller'],
    ['grace@example.com', 'Grace', 'Wilson'],
    ['henry@example.com', 'Henry', 'Moore'],
    ['iris@example.com', 'Iris', 'Taylor'],
    ['jack@example.com', 'Jack', 'Anderson'],
  ]

  const userStmt = db.prepare(
    'INSERT OR IGNORE INTO users (email, first_name, last_name) VALUES (?, ?, ?)',
  )
  for (const user of users) {
    userStmt.run(...user)
  }

  // Orders (15 orders with realistic totals and statuses)
  const orders = [
    // Alice (3 orders)
    [1, 129.98, 'paid'],
    [1, 999.99, 'paid'],
    [1, 89.99, 'paid'],
    // Bob (3 orders)
    [2, 79.99, 'pending'],
    [2, 249.98, 'paid'],
    [2, 54.99, 'paid'],
    // Carol (1 order)
    [3, 49.99, 'paid'],
    // Dave (2 orders)
    [4, 1149.98, 'pending'],
    [4, 199.99, 'paid'],
    // Eve (2 orders)
    [5, 199.99, 'paid'],
    [5, 59.99, 'paid'],
    // Frank (1 order)
    [6, 1049.98, 'paid'],
    // Grace (1 order)
    [7, 39.99, 'pending'],
    // Henry (1 order)
    [8, 89.98, 'paid'],
    // Iris (1 order)
    [9, 119.98, 'paid'],
  ]

  const orderStmt = db.prepare(
    'INSERT OR IGNORE INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
  )
  for (const order of orders) {
    orderStmt.run(...order)
  }

  // Order items (25 items across 15 orders - realistic purchase patterns)
  const orderItems = [
    // Order 1: Alice - 2 T-shirts + 1 Coffee Maker = $129.98
    [1, 6, 2, 29.99],
    [1, 13, 1, 69.99],
    // Order 2: Alice - 1 Laptop = $999.99
    [2, 1, 1, 999.99],
    // Order 3: Alice - 1 Running Shoes = $89.99
    [3, 10, 1, 89.99],
    // Order 4: Bob - 1 Jeans = $79.99
    [4, 7, 1, 79.99],
    // Order 5: Bob - 2 T-shirts + 2 Desk Lamps = $249.98
    [5, 6, 2, 29.99],
    [5, 14, 2, 45.99],
    // Order 6: Bob - 1 Python Book = $54.99
    [6, 12, 1, 54.99],
    // Order 7: Carol - 1 SQL Book = $49.99
    [7, 11, 1, 49.99],
    // Order 8: Dave - 1 Laptop + 1 Headphones = $1149.98
    [8, 1, 1, 999.99],
    [8, 3, 1, 199.99],
    // Order 9: Dave - 1 Air Purifier = $199.99
    [9, 16, 1, 199.99],
    // Order 10: Eve - 1 Headphones = $199.99
    [10, 3, 1, 199.99],
    // Order 11: Eve - 1 Hoodie = $59.99
    [11, 11, 1, 59.99],
    // Order 12: Frank - 1 Laptop + 1 Mechanical Keyboard = $1049.98
    [12, 1, 1, 999.99],
    [12, 5, 1, 49.99],
    // Order 13: Grace - 1 JavaScript Book = $39.99
    [13, 12, 1, 39.99],
    // Order 14: Henry - 1 Coffee Maker + 1 Wireless Mouse = $89.98
    [14, 13, 1, 69.99],
    [14, 4, 1, 19.99],
    // Order 15: Iris - 1 Jeans + 1 T-Shirt = $119.98
    [15, 7, 1, 79.99],
    [15, 6, 1, 29.99],
  ]

  const itemStmt = db.prepare(
    'INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
  )
  for (const item of orderItems) {
    itemStmt.run(...item)
  }

  console.log('✅ Sample data seeded successfully!')
}
