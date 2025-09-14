// filepath: api/tasks.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Define the Task schema and model (only do this once)
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  priority: String,
  dueDate: Date,
});

let Task; // Define Task outside the handler

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB (only if not already connected)
      if (!mongoose.connection.readyState) {
        const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
        Task = mongoose.model('Task', taskSchema); // Define Task here after connection
      }

      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      // Connect to MongoDB (only if not already connected)
      if (!mongoose.connection.readyState) {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        Task = mongoose.model('Task', taskSchema); // Define Task here after connection
      }

      const task = new Task({
        title: req.body.title,
        completed: req.body.completed,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
      });

      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); // Handle other methods
  }
};