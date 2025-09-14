import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: { minutes: 25, label: 'Focus Time' },
  shortBreak: { minutes: 5, label: 'Short Break' },
  longBreak: { minutes: 15, label: 'Long Break' }
};

interface PomodoroStats {
  completedPomodoros: number;
  totalFocusTime: number; // in minutes
  totalBreakTime: number; // in minutes
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [stats, setStats] = useState<PomodoroStats>(() => {
    const saved = localStorage.getItem('pomodoroStats');
    return saved ? JSON.parse(saved) : {
      completedPomodoros: 0,
      totalFocusTime: 0,
      totalBreakTime: 0
    };
  });
  const [customMinutes, setCustomMinutes] = useState('25');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playNotificationSound();
      
      // Update stats
      if (mode === 'work') {
        setStats(prev => ({
          ...prev,
          completedPomodoros: prev.completedPomodoros + 1,
          totalFocusTime: prev.totalFocusTime + TIMER_SETTINGS.work.minutes
        }));
        setPomodoroCount(prev => prev + 1);
        
        // Auto-switch to break
        const nextMode = pomodoroCount % 4 === 3 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(TIMER_SETTINGS[nextMode].minutes * 60);
      } else {
        setStats(prev => ({
          ...prev,
          totalBreakTime: prev.totalBreakTime + TIMER_SETTINGS[mode].minutes
        }));
        
        // Auto-switch to work
        setMode('work');
        setTimeLeft(TIMER_SETTINGS.work.minutes * 60);
      }
    }
  }, [timeLeft, isRunning, mode, pomodoroCount]);

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio notification not available');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode].minutes * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[newMode].minutes * 60);
  };

  const setCustomTimer = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 120) {
      setIsRunning(false);
      setTimeLeft(minutes * 60);
    }
  };

  const resetStats = () => {
    const newStats = {
      completedPomodoros: 0,
      totalFocusTime: 0,
      totalBreakTime: 0
    };
    setStats(newStats);
    setPomodoroCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProgress = () => {
    const totalTime = TIMER_SETTINGS[mode].minutes * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeIcon = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work': return <Target className="w-4 h-4" />;
      case 'shortBreak': return <Coffee className="w-4 h-4" />;
      case 'longBreak': return <Coffee className="w-4 h-4" />;
    }
  };

  const getModeColor = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shortBreak': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'longBreak': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Pomodoros</p>
                <p className="text-2xl font-bold">{stats.completedPomodoros}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Focus Time</p>
                <p className="text-2xl font-bold">{formatHours(stats.totalFocusTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Break Time</p>
                <p className="text-2xl font-bold">{formatHours(stats.totalBreakTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Timer */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle>Pomodoro Timer</CardTitle>
              <Badge className={getModeColor(mode)}>
                {getModeIcon(mode)}
                {TIMER_SETTINGS[mode].label}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetStats}
            >
              Reset Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            <Progress value={getProgress()} className="w-full max-w-md mx-auto" />
            <p className="text-muted-foreground">
              Session {pomodoroCount + 1} • {Math.ceil(pomodoroCount / 4)} cycles completed
            </p>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="gap-2"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(TIMER_SETTINGS) as TimerMode[]).map((timerMode) => (
              <Button
                key={timerMode}
                variant={mode === timerMode ? "default" : "outline"}
                onClick={() => switchMode(timerMode)}
                className="gap-2"
                disabled={isRunning}
              >
                {getModeIcon(timerMode)}
                {TIMER_SETTINGS[timerMode].label}
                <span className="text-sm text-muted-foreground">
                  ({TIMER_SETTINGS[timerMode].minutes}m)
                </span>
              </Button>
            ))}
          </div>

          {/* Custom Timer */}
          <div className="flex items-center gap-2 justify-center">
            <label className="text-sm">Custom:</label>
            <Select value={customMinutes} onValueChange={setCustomMinutes}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10m</SelectItem>
                <SelectItem value="15">15m</SelectItem>
                <SelectItem value="20">20m</SelectItem>
                <SelectItem value="25">25m</SelectItem>
                <SelectItem value="30">30m</SelectItem>
                <SelectItem value="45">45m</SelectItem>
                <SelectItem value="60">60m</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setCustomTimer}
              disabled={isRunning}
            >
              Set
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}