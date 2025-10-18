"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

interface Task {
  id: number;
  created_at: string;
  text: string;
  is_completed: boolean;
  user_id: string;
}

export default function TodoDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  useEffect(() => {
    const getUserAndTasks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching tasks : ", error);
      } else if (data) {
        setTasks(data);
      }
    };
    getUserAndTasks();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "" || !user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTask, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks([...tasks, data]);

      setNewTask("");
    }
  };

  const handleDelete = async (taskId: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleToggleComplete = async (
    taskId: number,
    currentStatus: boolean
  ) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !currentStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: !currentStatus } : task
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks for Today</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg items-center space-x-2 mx-auto mb-8"
      >
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="bg-white/5 border-white/10 focus:ring-blue-500"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      <div className="w-full max-w-lg mx-auto">
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-white/5 p-3 rounded-lg mb-2"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={task.id.toString()}
                    checked={task.is_completed}
                    onCheckedChange={() =>
                      handleToggleComplete(task.id, task.is_completed)
                    }
                  />
                  <label
                    htmlFor={task.id.toString()}
                    className={`text-sm font-medium leading-none ${
                      task.is_completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.text}
                  </label>
                </div>
                <span>{task.text}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <p>Loading tasks or add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
