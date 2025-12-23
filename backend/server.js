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

async function resetTables() {
  await pool.query(`
    DROP TABLE IF EXISTS food_items;
    DROP TABLE IF EXISTS task_list;
    DROP TABLE IF EXISTS dinner_time;

    CREATE TABLE dinner_time (
      "id" SERIAL PRIMARY KEY,
      "username" TEXT,
      "dinnerTime" TEXT
    );

    CREATE TABLE task_list (
      "id" SERIAL PRIMARY KEY,
      "username" TEXT,
      "timeStamp" INTEGER,
      "action" TEXT,
      "isTask" BOOLEAN,
      "isDone" BOOLEAN,
      "item" TEXT
    );

    CREATE TABLE food_items (
      "id" SERIAL PRIMARY KEY,
      "username" TEXT,
      "title" TEXT,
      "prepTime" INTEGER,
      "boilTime" INTEGER,
      "cookTime" INTEGER,
      "prepBefore" BOOLEAN
    );
  `);
}

async function defaultDinnerTime(username) {
  if (!username) throw new Error("Username is needed");

  const result = await pool.query(`SELECT COUNT(*) FROM dinner_time WHERE username = $1`, [username]);
    
  if (Number(result.rows[0].count) === 0) {
      await pool.query(
        `INSERT INTO dinner_time (username, "dinnerTime") VALUES ($1, $2)`,
        [username, '12:00'] // default dinner time
      );
      console.log(`Default dinner time inserted for ${username}`);
    }
}

// At the top, after pool is defined
async function createTablesIfNotExist() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dinner_time (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT,
        "dinnerTime" TEXT
      );

      CREATE TABLE IF NOT EXISTS task_list (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT,
        "timeStamp" INTEGER,
        "action" TEXT,
        "isTask" BOOLEAN,
        "isDone" BOOLEAN,
        "item" TEXT
      );

      CREATE TABLE IF NOT EXISTS food_items (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT,
        "title" TEXT,
        "prepTime" INTEGER,
        "boilTime" INTEGER,
        "cookTime" INTEGER,
        "prepBefore" BOOLEAN
      );
    `);

    console.log("Tables checked/created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

app.post('/reset-tables/:username', async (req, res) => {
  const {username} = req.params;
  try {
    await resetTables();
    res.json({ message: `Tables reset for ${username} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Call it once when server starts
createTablesIfNotExist();

// Get dinner time

app.get('/dinner_time/:username', async (req, res) => {
  const {username} = req.params;
  try {
    await defaultDinnerTime(username);

    const result = await pool.query('SELECT * FROM dinner_time WHERE "username" = $1', [username]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});


// Update dinner time 
app.put('/dinner_time/:username', async (req, res) =>{
  const {username} = req.params;
  const { id, dinnerTime } = req.body;

  if (!id) {
    return res.status(400).json({ error: " ID is required" });
  }

  try {
    const result = await pool.query(` UPDATE dinner_time SET "dinnerTime" = $1 WHERE "id" = $2 AND "username" = $3 RETURNING *`, 
      [dinnerTime, id, username]
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
app.post('/add_task/:username', async (req, res) => {
  const {username} = req.params;
  const { timeStamp, action, isTask, isDone, item } = req.body;

  if (!action) {
    return res.status(400).json({ error: "Add a task" });
  }

  try {
    const result = await pool.query (
      ` INSERT INTO task_list ("username", "timeStamp", "action", "isTask", "isDone", "item")
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
    [username, timeStamp, action, isTask, isDone, item]
    );
    res.json(result.rows[0]);
  } catch(err){
    res.status(500).json({error: err.message})
  }
});

// Edit a task
app.put('/edit_task/:username', async(req, res) =>{
  const {username} = req.params;
  const { id, timeStamp, action, isTask, isDone, item} = req.body;
   if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const result = await pool.query(` UPDATE task_list
  SET "timeStamp" = $1, "action" = $2, "isTask" = $3, "isDone" = $4, "item" = $5
  WHERE "id" = $6 AND "username" = $7 RETURNING *`, [timeStamp, action, isTask, isDone, item , id, username]);
  if (result.rowCount === 0) {
    return res.status(404).json({error: "No task found with that ID"});
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});


// Mark task as done 
app.put('/edit_task/done/:username', async (req, res) =>{
  const {username} = req.params;
  const { id, timeStamp, action, isTask, isDone, item } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const result = await pool.query(`UPDATE task_list
  SET "action" = $1, "timeStamp" = $2, "isTask" = $3, "isDone" = $4, "item" = $5
  WHERE "id" = $6 AND "username"= $7 RETURNING *`, [action, timeStamp, isTask, isDone, item, id, username]);
  if (result.rowCount === 0){
    return res.status(404).json({error: "No task found with that ID"});
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Delete a task from id
app.delete('/delete_task/:id/:username', async (req, res) => {
  const {username} = req.params;
  const { id } = req.params;
  if (!id) { 
    return res.status(400).json({error: "Task needs an ID"});
  }

  try {
    const result = await pool.query ( `DELETE FROM task_list WHERE "id" = $1 AND "username" = $2 RETURNING *`, [id, username]);
    if (result.rowCount === 0){
      return res.status(404).json({ message: "ID doesnt match a task" });
    }
    res.json({message: `Task with ID ${id} and username ${username} deleted`})
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});


// Delete a task from item title
app.delete('/delete_item_task/:item/:username', async (req, res) => {
  const { item, username } = req.params;
  if (!item) { 
    return res.status(400).json({error: "Task needs an item title"});
  }

  try {
    const result = await pool.query(`DELETE FROM task_list WHERE "item" = $1 AND "username" = $2 RETURNING *`, [item, username]);
    if (result.rowCount === 0) {
      return res.status(404).json({deleted: result.rowCount, message: "Item doesn't match a task"});
    }
    res.json({message: `${result.rowCount} task(s) deleted for ${username}`, deleted:result.rowCount})
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

// Add a food item 
app.post('/add_item/:username', async (req, res) =>{
  const {username} = req.params;
  const { title, prepTime, boilTime, cookTime, prepBefore} = req.body;
  if (!title) {
    return res.status(400).json({error: "Add a title"});
  }

  try {
    const result = await pool.query (`INSERT INTO food_items ( "username", "title", "prepTime", "boilTime", "cookTime", "prepBefore")
      VALUES ( $1, $2, $3, $4, $5, $6) RETURNING *`, [username, title, prepTime, boilTime, cookTime, prepBefore]);
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Edit a food item
app.put('/edit_item/:username', async (req, res) =>{
  const {username} = req.params;
  const { id, title, prepTime, boilTime, cookTime, prepBefore } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Food item ID is required" });
  }

  try{
    const result = await pool.query(`UPDATE food_items SET "title" = $1, "prepTime" = $2, "boilTime" = $3, "cookTime" = $4, "prepBefore" = $5
  WHERE "id" = $6 AND "username" = $7 RETURNING *`, [title, prepTime, boilTime, cookTime, prepBefore, id, username]);
  if (result.rowCount === 0) {
    return res.status(404).json({error: "No food item found with that ID"})
  }
  res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Delete a food item 
app.delete('/delete_item/:id/:username', async (req, res) => {
  const { id, username } = req.params;
  if (!id) { 
    return res.status(400).json({error: "Food item needs an ID"});
  }

  try {
    const result = await pool.query (`DELETE FROM food_items WHERE "id" = $1 AND "username" = $2 RETURNING *`, [id, username]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ID doesnt match a food item" });
    }
    res.json({message: `Food item with ID ${id} and username ${username} deleted`});
  } catch(err) {
    res.status(500).json({error:err.message});
  }
});


// Get all tasks
app.get('/task_list/:username', async (req, res) => {
  const {username} = req.params;
  try{
    const result = await pool.query(`SELECT * FROM task_list WHERE "username" = $1`, [username]);
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// Get all food items
app.get(`/food_items/:username`, async (req, res) => {
  const {username} = req.params;
  try {
    const result = await pool.query (`SELECT * FROM food_items WHERE "username" = $1`, [username]);
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
