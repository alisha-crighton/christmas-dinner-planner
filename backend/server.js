// server.js
const express = require('express');
const cors = require('cors');
// const db = require('./database');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});


const app = express();
app.use(cors());
app.use(express.json());

// At the top, after pool is defined
async function createTablesIfNotExist() {
  try {

    await pool.query(`
      DROP TABLE IF EXISTS food_items;
      DROP TABLE IF EXISTS task_list;
      DROP TABLE IF EXISTS dinner_time;
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dinner_time (
        id SERIAL PRIMARY KEY,
        dinnerTime TEXT
      );
      
      CREATE TABLE IF NOT EXISTS task_list (
        id SERIAL PRIMARY KEY,
        timeStamp TEXT,
        action TEXT,
        isTask BOOLEAN,
        isDone BOOLEAN,
        item TEXT
      );

      CREATE TABLE IF NOT EXISTS food_items (
        id SERIAL PRIMARY KEY,
        title TEXT,
        prepTime NUMBER,
        boilTime NUMBER,
        cookTime NUMBER,
        prepBefore NUMBER
      );
    `);
    console.log("Tables checked/created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

app.post('/seed-dinner-time', async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO dinner_time (dinnerTime) VALUES ($1) RETURNING *`,
      ['18:00'] // initial dinner time, e.g., 6 PM
    );
    res.json({ message: 'Dinner time seeded', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/reset-tables', async (req, res) => {
  try {
    await resetTables();
    res.json({ message: "Tables reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Call it once when server starts
createTablesIfNotExist();

// Get dinner time

app.get('/dinner_time', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dinner_time');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});


// Update dinner time 
app.put('/dinner_time', async (req, res) =>{
  const { id, dinnerTime } = req.body;

  if (!id) {
    return res.status(400).json({ error: " ID is required" });
  }

  try {
    const result = await pool.query(` UPDATE dinner_time SET dinnerTime = $1 WHERE id = $2 RETURNING *`, 
      [dinnerTime, id]
    );
    if (result.rowCount === 0) {
    return res.status(404).json({ error: "Nothing found with that ID" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});


// Add a task
app.post('/add_task', async (req, res) => {
  const { timeStamp, action, isTask, isDone, item } = req.body;

  if (!action) {
    return res.status(400).json({ error: "Add a task" });
  }

  try {
    const result = await pool.query (
      ` INSERT INTO task_list (timeStamp, action, isTask, isDone, item)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
    [timeStamp, action, isTask, isDone, item]
    );
    res.json(result.rows[0]);
  } catch(err){
    res.status(500).json({error: err.message})
  }
});

// Edit a task
app.put('/edit_task', async(req, res) =>{
  const { id, timeStamp, action, isTask, isDone, item} = req.body;
   if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const result = await pool.query(` UPDATE task_list
  SET timeStamp = $1, action = $2, isTask = $3, isDone = $4, item = $5
  WHERE id = $6 RETURNING *`, [timeStamp, action, isTask, isDone, item , id]);
  if (result.rowCount === 0) {
    return res.status(404).json({error: "No task found with that ID"});
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});


// Mark task as done 
app.put('/edit_task/done', async (req, res) =>{
  const { id, timeStamp, action, isTask, isDone, item } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const result = await pool.query(`UPDATE task_list
  SET action = $1, timeStamp = $2, isTask = $3, isDone = $4, item = $5
  WHERE id = $6 RETURNING *`, [action, timeStamp, isTask, isDone, item, id]);
  if (result.rowCount === 0){
    return res.status(404).json({error: "No task found with that ID"});
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Delete a task from id
app.delete('/delete_task/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) { 
    return res.status(400).json({error: "Task needs an ID"});
  }

  try {
    const result = await pool.query ( `DELETE FROM task_list WHERE id = $1 RETURNING *`, [id]);
    if (result.rowCount === 0){
      return res.status(404).json({ message: "ID doesnt match a task" });
    }
    res.json({message: `Task with ID ${id} deleted`})
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});


// Delete a task from item title
app.delete('/delete_item_task/:item', async (req, res) => {
  const { item } = req.params;
  if (!item) { 
    return res.status(400).json({error: "Task needs an item title"});
  }

  try {
    const result = await pool.query(`DELETE FROM task_list WHERE item = $1 RETURNING *`, [item]);
    if (result.rowCount === 0) {
      return res.status(404).json({deleted: result.rowCount, message: "Item doesn't match a task"});
    }
    res.json({message: `${result.rowCount} task(s) deleted`, deleted:result.rowCount})
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

// Add a food item 
app.post('/add_item', async (req, res) =>{
  const { title, prepTime, boilTime, cookTime, prepBefore} = req.body;
  if (!title) {
    return res.status(400).json({error: "Add a title"});
  }

  try {
    const result = await pool.query (`INSERT INTO food_items ( title, prepTime, boilTime, cookTime, prepBefore)
      VALUES ( $1, $2, $3, $4, $5) RETURNING *`, [title, prepTime, boilTime, cookTime, prepBefore]);
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Edit a food item
app.put('/edit_item', async (req, res) =>{
  const { id, title, prepTime, boilTime, cookTime, prepBefore } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Food item ID is required" });
  }

  try{
    const result = await pool.query(`UPDATE food_items SET title = $1, prepTime = $2, boilTime = $3, cookTime = $4, prepBefore = $5
  WHERE id = $6 RETURNING *`, [title, prepTime, boilTime, cookTime, prepBefore, id]);
  if (result.rowCount === 0) {
    return res.status(404).json({error: "No food item found with that ID"})
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Delete a food item 
app.delete('/delete_item/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) { 
    return res.status(400).json({error: "Food item needs an ID"});
  }

  try {
    const result = await pool.query (`DELETE FROM food_items WHERE id = $1 RETURNING *`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ID doesnt match a food item" });
    }
    res.json({message: `Food item with ID ${id} deleted`});
  } catch(err) {
    res.status(500).json({error:err.message});
  }
});


// Get all tasks
app.get('/task_list', async (req, res) => {
  try{
    const result = await pool.query(`SELECT * FROM task_list`);
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Get all food items
app.get('/food_items', async (req, res) => {
  try {
    const result = await pool.query (`SELECT * FROM food_items`);
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
