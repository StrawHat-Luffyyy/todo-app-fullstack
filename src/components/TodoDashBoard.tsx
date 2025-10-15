"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Task {
  id: number;
  created_at: string;
  text: string;
  is_completed: boolean;
}

export default function TodoDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");


  useEffect(() => {
    const getTasks = async () => {
      const { data, error } = await supabase.from("todos").select("*")

      if (error) {
        console.error("Error fetching tasks:", error)
      } else {
        setTasks(data)
      }
    }
    getTasks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTask }])
      .select()
      .single()


    if (error) {
      console.error("Error fetching tasks:", error)
    } else {
      setTasks([...tasks, data]);

      setNewTask("");
    };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle
            className="h-4 w-4 mr-2" />
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
                <span>{task.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <p>Your tasks will appear here.</p>
          </div>
        )
        }
      </div>
    </div>
  );
}
