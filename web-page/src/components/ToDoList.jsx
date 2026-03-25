"use client"; 

import { useState, useEffect } from "react";

export default function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch("/api/todos")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Failed to load tasks", err));
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault(); 
        if (!newTask.trim()) return; 

        setIsLoading(true);
        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTask }),
            });

            if (response.ok) {
                const addedTask = await response.json();
                setTasks([...tasks, addedTask]);
                setNewTask(""); 
            }
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: Function to handle clicking the circle
    const handleDeleteTask = async (idToRemove) => {
        // 1. Instantly remove it from the screen so it feels incredibly fast
        setTasks(tasks.filter(task => task.id !== idToRemove));

        // 2. Tell the backend database to actually delete it
        try {
            await fetch("/api/todos", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: idToRemove }),
            });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="w-full h-full p-6 border-2 border-gray-900 rounded-lg bg-white flex flex-col">
            <div className="flex items-center mb-6 pb-2 border-b-2 border-gray-900">
                <span className="text-lg mr-2">✅</span>
                <h2 className="text-xl font-extrabold uppercase text-gray-900">TO-DO LIST</h2>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
                {/* Updated the empty state message slightly */}
                {tasks.length === 0 ? <p className="text-sm text-gray-500 font-medium">No tasks yet. You're all caught up!</p> : null}
                
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center space-x-4 group">
                        {/* CHANGED: This is now a clickable button instead of a static div */}
                        <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-5 h-5 rounded-full border-2 border-gray-400 bg-white flex-shrink-0 cursor-pointer hover:bg-simconnect-green hover:border-simconnect-green transition-colors flex items-center justify-center"
                        >
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100">✓</span>
                        </button>
                        <span className="text-sm font-medium text-gray-900">{task.title}</span>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddTask} className="flex flex-col space-y-3 mt-auto">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="E.g., Review Math Lecture"
                    className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 border-2 border-gray-900 bg-simconnect-button rounded-lg text-sm font-bold uppercase text-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                    {isLoading ? "Adding..." : "+ Add New Task"}
                </button>
            </form>
        </div>
    );
}