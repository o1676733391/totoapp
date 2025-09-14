import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './utils'; // Ensure this path is correct
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export type Task = {
  _id: string;
  title: string;
  completed: boolean;
  priority: string;
  dueDate?: Date;
};

type TaskManagerProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onAddTask: (newTask: Omit<Task, '_id'>) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (id: string) => void;
};

interface TaskPrioritySelectProps {
  taskId: string;
  priority: string;
  onPriorityChange: (id: string, priority: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [priority, setPriority] = React.useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem = {
        title: newTask,
        completed: false,
        priority: priority,
        dueDate: date,
      };
      onAddTask(newTaskItem);
      setNewTask('');
      setDate(undefined);
      setPriority('');
    }
  };

  const handleTaskCompletion = (id: string, completed: boolean) => {
    const updatedTask = tasks.find(task => task._id === id);
    if (updatedTask) {
      onUpdateTask({ ...updatedTask, completed });
    }
  };

  const handlePriorityChange = (id: string, priority: string) => {
    const updatedTask = tasks.find(task => task._id === id);
    if (updatedTask) {
      onUpdateTask({ ...updatedTask, priority });
    }
  };

  const handleDateChange = (id: string, dueDate: Date | undefined) => {
    const updatedTask = tasks.find(task => task._id === id);
    if (updatedTask) {
      onUpdateTask({ ...updatedTask, dueDate });
    }
  };

  const handleDeleteTask = (id: string) => {
    onDeleteTask(id);
  };

  const TaskPrioritySelect: React.FC<TaskPrioritySelectProps> = ({ taskId, priority, onPriorityChange }) => (
    <Select onValueChange={(value: string) => onPriorityChange(taskId, value)} defaultValue={priority}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date: Date) =>
                date > new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Select onValueChange={(value: string) => setPriority(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask}><Plus className="h-4 w-4 mr-2" />Add Task</Button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet. Add some!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task._id} className="flex items-center justify-between gap-4 border rounded-md p-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`task-${task._id}`}
                  checked={task.completed}
                  onCheckedChange={(checked: boolean | "indeterminate") => handleTaskCompletion(task._id, !!checked)}
                />
                <Label htmlFor={`task-${task._id}`} className="text-sm line-clamp-1">
                  {task.title}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <TaskPrioritySelect
                  taskId={task._id}
                  priority={task.priority}
                  onPriorityChange={handlePriorityChange}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[180px] justify-start text-left font-normal',
                        !task.dueDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {task.dueDate ? format(task.dueDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={task.dueDate ? new Date(task.dueDate) : undefined}
                      onSelect={(date: Date | undefined) => handleDateChange(task._id, date)}
                      disabled={(date: Date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteTask(task._id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;