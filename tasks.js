import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  category: String,
  createdAt: { type: Date, default: Date.now }
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

  try {
    if (req.method === 'GET') {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.status(200).json(tasks);
      
    } else if (req.method === 'POST') {
      const task = new Task(req.body);
      const newTask = await task.save();
      res.status(201).json(newTask);
      
    } else if (req.method === 'PATCH') {
      const { id } = req.query;
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(updatedTask);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
      
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}