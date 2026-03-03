"use client"

import { useEffect, useState } from "react";
import { Calendar, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/axios";

interface ChartData {
  totalMeetings: number;
  actionItems: number;
  completedTasks: number;
  upcomingMeetings: number;
  weeklyActivity: { day: string; count: number }[];
  tasksCompleted: { day: string; count: number }[];
}

export default function Charts() {
  const [data, setData] = useState<ChartData>({
    totalMeetings: 0,
    actionItems: 0,
    completedTasks: 0,
    upcomingMeetings: 0,
    weeklyActivity: [],
    tasksCompleted: [],
  });

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [meetingsRes, tasksRes] = await Promise.all([
        api.get("/meetings"),
        api.get("/tasks/all"),
      ]);

      const meetings = meetingsRes.data;
      const tasks = tasksRes.data;

      // Calculate stats
      const now = new Date();
      const upcomingMeetings = meetings.filter(
        (m: any) => new Date(m.startTime) > now
      ).length;

      const completedTasks = tasks.filter(
        (t: any) => t.status === "DONE"
      ).length;

      const actionItems = tasks.length;

      // Weekly activity data (meetings per day)
      const weeklyActivity = calculateWeeklyData(meetings, "startTime");
      
      // Tasks completed per day
      const tasksCompleted = calculateWeeklyTasks(tasks);

      setData({
        totalMeetings: meetings.length,
        actionItems,
        completedTasks,
        upcomingMeetings,
        weeklyActivity,
        tasksCompleted,
      });
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  const calculateWeeklyData = (items: any[], dateField: string) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = new Array(7).fill(0);

    items.forEach((item) => {
      const date = new Date(item[dateField]);
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      counts[dayIndex]++;
    });

    return days.map((day, index) => ({ day, count: counts[index] }));
  };

  const calculateWeeklyTasks = (tasks: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = new Array(7).fill(0);

    tasks
      .filter((t) => t.status === "DONE" && t.updatedAt)
      .forEach((task) => {
        const date = new Date(task.updatedAt);
        const dayIndex = (date.getDay() + 6) % 7;
        counts[dayIndex]++;
      });

    return days.map((day, index) => ({ day, count: counts[index] }));
  };

  const statCards = [
    {
      icon: Calendar,
      value: data.totalMeetings,
      label: "Total Meetings",
      change: "+12%",
      bgColor: "bg-blue-500",
    },
    {
      icon: CheckSquare,
      value: data.actionItems,
      label: "Action Items",
      change: "+8%",
      bgColor: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      value: data.completedTasks,
      label: "Completed Tasks",
      change: "+23%",
      bgColor: "bg-green-500",
    },
    {
      icon: Clock,
      value: data.upcomingMeetings,
      label: "Upcoming Meetings",
      change: `+${data.upcomingMeetings}`,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-semibold">
                {card.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.weeklyActivity}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks Completed Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Tasks Completed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.tasksCompleted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

