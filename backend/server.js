// server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Get dinner time

app.get('/dinner_time', (req, res) => {
  db.all(`SELECT * FROM dinner_time`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Update dinner time 
app.put('/dinner_time', (req, res) =>{
  const { id, dinnerTime } = req.body;

  const query = `
  UPDATE dinner_time
  SET dinnerTime = ?
  WHERE id = ?
  `;

  const params = [dinnerTime, id];

  if (!id) {
    return res.status(400).json({ error: " ID is required" });
  }

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
    return res.status(404).json({ error: "Nothing found with that ID" });
  }

    res.json({
      id,
      dinnerTime
    });
  });

})


// Add a task
app.post('/add_task', (req, res) => {
  const { id, timeStamp, action, isTask, isDone, item } = req.body;

  if (!action) {
    return res.status(400).json({ error: "Add a task" });
  }

  const query = `
    INSERT INTO task_list (id, timeStamp, action, isTask, isDone, item)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [id, timeStamp, action, isTask, isDone, item];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      id: this.lastID,
      timeStamp,
      action, 
      isTask, 
      isDone, 
      item
    });
  });
});


// Edit a task
app.put('/edit_task', (req, res) =>{
  const { id, timeStamp, action, isTask, isDone, item} = req.body;

  const query = `
  UPDATE task_list
  SET timeStamp = ?, action = ?, isTask = ?, isDone = ?, item = ?
  WHERE id = ?
  `;

  const params = [timeStamp, action, isTask, isDone, item, id];

  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
    return res.status(404).json({ error: "No task found with that ID" });
  }

    res.json({
      id,
      timeStamp,
      action,
      isTask, 
      isDone, 
      item
    });
  });

})


// Mark task as done 
app.put('/edit_task/done', (req, res) =>{
  const { id, timeStamp, action, isTask, isDone, item } = req.body;

  const query = `
  UPDATE task_list
  SET action = ?, timeStamp = ?, isTask = ?, isDone = ?, item = ?
  WHERE id = ?
  `;

  const params = [action, timeStamp, isTask, isDone, item, id];

  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
    return res.status(404).json({ error: "No task found with that ID" });
  }

    res.json({
      id,
      timeStamp,
      action,
      isTask, 
      isDone, 
      item
    });
  });

})


// Delete a task from id
app.delete('/delete_task/:id', (req, res) => {

  const { id } = req.params;

  if (!id) { 
    return res.status(400).json({error: "Task needs an ID"});
  }

  const query = `DELETE FROM task_list WHERE id = ?`;

  db.run(query, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: "ID doesnt match a task" });
    }

    res.json({ message: `Task with ID ${id} deleted` });
  });
});


// Delete a task from item title
app.delete('/delete_item_task/:item', (req, res) => {

  const { item } = req.params;

  if (!item) { 
    return res.status(400).json({error: "Task needs an item title"});
  }

  const query = `DELETE FROM task_list WHERE item = ?`;

  db.run(query, [item], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ 
      deleted: this.changes,
      message: `${this.changes} task(s) with item title ${item} deleted` });
  });
});

// Add a food item 
app.post('/add_item', (req, res) =>{
  const { title, prepTime, boilTime, cookTime, prepBefore} = req.body;

  if (!title) {
    return res.status(400).json({error: "Add a title"});
  }

  const query = `
  INSERT INTO food_items ( title, prepTime, boilTime, cookTime, prepBefore)
  VALUES ( ?, ?, ?, ?, ?)
  `;

  const params = [ title, prepTime, boilTime, cookTime, prepBefore];
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      id: this.lastID,
      title,
      prepTime, 
      boilTime, 
      cookTime, 
      prepBefore
    });
  });

})


// Edit a food item
app.put('/edit_item', (req, res) =>{
  const { id, title, prepTime, boilTime, cookTime, prepBefore } = req.body;

  const query = `
  UPDATE food_items
  SET title = ?, prepTime = ?, boilTime = ?, cookTime = ?, prepBefore = ?
  WHERE id = ?
  `;

  const params = [title, prepTime, boilTime, cookTime, prepBefore, id];

  if (!id) {
    return res.status(400).json({ error: "Food item ID is required" });
  }

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
    return res.status(404).json({ error: "No food item found with that ID" });
  }

    res.json({
      id,
      title,
      prepTime,
      boilTime, 
      cookTime, 
      prepBefore
    });
  });

})


// Delete a food item 
app.delete('/delete_item/:id', (req, res) => {

  const { id } = req.params;

  if (!id) { 
    return res.status(400).json({error: "Food item needs an ID"});
  }

  const query = `DELETE FROM food_items WHERE id = ?`;

  db.run(query, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: "ID doesnt match a food item" });
    }

    res.json({ message: `Food item with ID ${id} deleted` });
  });
});


// Get all tasks
app.get('/task_list', (req, res) => {
  db.all(`SELECT * FROM task_list`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Get all food items
app.get('/food_items', (req, res) => {
  db.all(`SELECT * FROM food_items`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Start server
const PORT = 3002;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
