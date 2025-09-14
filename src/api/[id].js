// filepath: api/tasks/[id].js
const mongoose = require('mongoose');
require('dotenv').config();
const { query } = require('vercel');

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    priority: String,
    dueDate: Date,
});

let Task;

module.exports = async (req, res) => {
    const { id } = query; // Access the 'id' from the URL

    if (req.method === 'PATCH') {
        try {
            if (!mongoose.connection.readyState) {
                const uri = process.env.MONGODB_URI;
                await mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                Task = mongoose.model('Task', taskSchema);
            }

            const task = await Task.findById(id);
            if (!task) {
                return res.status(404).json({ message: 'Cannot find task' });
            }

            if (req.body.title != null) {
                task.title = req.body.title;
            }
            if (req.body.completed != null) {
                task.completed = req.body.completed;
            }
            if (req.body.priority != null) {
                task.priority = req.body.priority;
            }
            if (req.body.dueDate != null) {
                task.dueDate = req.body.dueDate;
            }

            const updatedTask = await task.save();
            res.json(updatedTask);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            if (!mongoose.connection.readyState) {
                const uri = process.env.MONGODB_URI;
                await mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                Task = mongoose.model('Task', taskSchema);
            }

            const task = await Task.findById(id);
            if (!task) {
                return res.status(404).json({ message: 'Cannot find task' });
            }

            await task.remove();
            res.json({ message: 'Deleted Task' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};