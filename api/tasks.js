import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  priority: String,
  dueDate: Date,
});

let Task;
let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI);
    Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
  }
}

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const task = new Task(req.body);
    const newTask = await task.save();
    res.status(201).json(newTask);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}