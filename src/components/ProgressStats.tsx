import React, { useMemo } from 'react';
import { CheckCircle2, Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { Task } from './TaskManager';

interface ProgressStatsProps {
  tasks: Task[];
}

export default function ProgressStats({ tasks }: ProgressStatsProps) {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
    const overdueTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    
    const tasksDueToday = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(task.dueDate).toDateString() === today;
    }).length;
    
    const tasksDueThisWeek = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Tasks by priority
    const priorityBreakdown = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };
    
    const priorityCompleted = {
      high: tasks.filter(task => task.priority === 'high' && task.completed).length,
      medium: tasks.filter(task => task.priority === 'medium' && task.completed).length,
      low: tasks.filter(task => task.priority === 'low' && task.completed).length
    };

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      overdueTasks,
      tasksDueToday,
      tasksDueThisWeek,
      completionRate,
      priorityBreakdown,
      priorityCompleted
    };
  }, [tasks]);

  const getMotivationalMessage = () => {
    if (stats.completionRate === 100 && stats.totalTasks > 0) {
      return "🎉 All tasks completed! You're amazing!";
    }
    if (stats.completionRate >= 80) {
      return "🚀 Great progress! Keep it up!";
    }
    if (stats.completionRate >= 50) {
      return "💪 You're halfway there!";
    }
    if (stats.overdueTasks > 0) {
      return "⚡ Focus on overdue tasks first!";
    }
    if (stats.tasksDueToday > 0) {
      return "📅 You have tasks due today!";
    }
    return "✨ Every step counts. Keep going!";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (stats.totalTasks === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="mb-2">No Data Yet</h3>
          <p className="text-muted-foreground text-center">
            Add some tasks to see your progress statistics and productivity insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Motivational Header */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="mb-2">Your Progress</h3>
            <p className="text-lg">{getMotivationalMessage()}</p>
            <div className="mt-4">
              <Progress value={stats.completionRate} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                {stats.completionRate.toFixed(1)}% of tasks completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{stats.highPriorityTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold">{stats.tasksDueToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.overdueTasks > 0 || stats.tasksDueToday > 0) && (
        <div className="space-y-3">
          {stats.overdueTasks > 0 && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p>
                    <span className="font-medium">{stats.overdueTasks} task{stats.overdueTasks !== 1 ? 's' : ''}</span> overdue
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {stats.tasksDueToday > 0 && (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <p>
                    <span className="font-medium">{stats.tasksDueToday} task{stats.tasksDueToday !== 1 ? 's' : ''}</span> due today
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tasks by Priority
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['high', 'medium', 'low'] as const).map(priority => {
            const total = stats.priorityBreakdown[priority];
            const completed = stats.priorityCompleted[priority];
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            return (
              <div key={priority} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(priority)}>
                      {priority} priority
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {completed}/{total} completed
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      {stats.tasksDueThisWeek > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have <span className="font-medium">{stats.tasksDueThisWeek} task{stats.tasksDueThisWeek !== 1 ? 's' : ''}</span> due this week.
              {stats.tasksDueToday > 0 && ` ${stats.tasksDueToday} of them are due today.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}