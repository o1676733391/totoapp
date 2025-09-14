// filepath: src/App.tsx
import { useState, useEffect } from 'react';
import { CheckSquare, Clock, BarChart3, Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import TaskManager from './components/TaskManager';
import type { Task } from './components/TaskManager';
import PomodoroTimer from './components/PomodoroTimer';
import ProgressStats from './components/ProgressStats';
import axios from 'axios';

const API_URL = '/api'; // or 'http://localhost:3000/api' for local development

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    fetchTasks();
  }, []);

// filepath: src/App.tsx
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    console.log("API Response:", response); // Log the entire response
    console.log("API Response Data:", response.data); // Log just the data
    if (Array.isArray(response.data)) {
      setTasks(response.data);
    } else {
      console.error('API returned invalid data:', response.data);
      setTasks([]); // Or some other default value
    }
    console.log("Tasks after fetch:", tasks); // Log tasks AFTER setting state
  } catch (error) {
    console.error('Error fetching tasks:', error);
    setTasks([]); // Or some other default value
  }
};

  const addTask = async (newTask: Omit<Task, '_id'>) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await axios.patch(`${API_URL}/tasks/${updatedTask._id}`, updatedTask);
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const navigationItems = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Focus Timer', icon: Clock },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  const NavigationContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-2">
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? 'default' : 'ghost'}
          className="w-full justify-start gap-2"
          onClick={() => {
            setActiveTab(item.id);
            onItemClick?.();
          }}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">StudyFlow</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-8">
                <div className="flex gap-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'default' : 'ghost'}
                      className="gap-2"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </nav>
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h2 className="font-bold">StudyFlow</h2>
                  </div>
                  <NavigationContent onItemClick={() => {}} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              {activeTab === 'tasks' && 'Organize your tasks and stay on top of deadlines'}
              {activeTab === 'timer' && 'Use the Pomodoro technique to boost your focus'}
              {activeTab === 'progress' && 'Track your productivity and celebrate achievements'}
            </p>
          </div>

          {/* Hidden tabs list for accessibility */}
          <TabsList className="hidden">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskManager
              tasks={tasks}
              setTasks={setTasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          {/* Timer Tab */}
          <TabsContent value="timer" className="space-y-6">
            <PomodoroTimer />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressStats tasks={tasks} />
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        {tasks.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.filter((t) => t.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t) => !t.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {tasks.filter((t) => t.priority === 'high' && !t.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {tasks.filter((t) => {
                      if (t.completed || !t.dueDate) return false;
                      return new Date(t.dueDate).toDateString() ===
                        new Date().toDateString();
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Due Today</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}