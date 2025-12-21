const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS task_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeStamp TEXT,
      action TEXT NOT NULL, 
      isTask BOOLEAN,
      isDone BOOLEAN, 
      item TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, 
      prepTime NUMBER, 
      boilTime NUMBER, 
      cookTime NUMBER, 
      prepBefore BOOLEAN
    )
  `);
  db.run( `
    CREATE TABLE IF NOT EXISTS dinner_time (
      id INTEGER PRIMARY KEY CHECK (id = 1), 
      dinnerTime TEXT
    )
  `);
  db.run(`
    INSERT INTO dinner_time (id, dinnerTime)
    VALUES (1, '12:00')
    `
  );
});

module.exports = db;
