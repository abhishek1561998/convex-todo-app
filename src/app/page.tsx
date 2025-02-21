"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const [newTodoText, setNewTodoText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string } | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const todos = useQuery(api.todos.list);
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const deleteTodo = useMutation(api.todos.remove);
  const editTodo = useMutation(api.todos.edit);

  // Theme toggle logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === "") return;
    await addTodo({ text: newTodoText });
    setNewTodoText("");
  };

  const handleEditTodo = (todo: { _id: string; text: string }) => {
    setEditingTodo({ id: todo._id, text: todo.text });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo || editingTodo.text.trim() === "") return;
    await editTodo({ id: editingTodo.id, text: editingTodo.text });
    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: string) => {
    setDeletingTodoId(id); // Start confirmation
  };

  const confirmDelete = async () => {
    if (deletingTodoId) {
      await deleteTodo({ id: deletingTodoId });
      setDeletingTodoId(null); // Reset after deletion
    }
  };

  const cancelDelete = () => {
    setDeletingTodoId(null); // Cancel confirmation
  };

  if (todos === undefined) {
    return (
      <main className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="particle particle-1 bg-blue-300 dark:bg-indigo-400 opacity-20 rounded-full absolute animate-float" />
          <div className="particle particle-2 bg-indigo-300 dark:bg-blue-400 opacity-20 rounded-full absolute animate-float-delayed" />
          <div className="particle particle-3 bg-blue-200 dark:bg-indigo-300 opacity-20 rounded-full absolute animate-float" />
          <div className="particle particle-4 bg-indigo-200 dark:bg-blue-300 opacity-20 rounded-full absolute animate-float-delayed" />
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 dark:border-indigo-400"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle particle-1 bg-blue-300 dark:bg-indigo-400 opacity-20 rounded-full absolute animate-float" />
        <div className="particle particle-2 bg-indigo-300 dark:bg-blue-400 opacity-20 rounded-full absolute animate-float-delayed" />
        <div className="particle particle-3 bg-blue-200 dark:bg-indigo-300 opacity-20 rounded-full absolute animate-float" />
        <div className="particle particle-4 bg-indigo-200 dark:bg-blue-300 opacity-20 rounded-full absolute animate-float-delayed" />
      </div>

      {/* Card */}
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl relative z-10">
        {/* Header with Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight transition-all duration-300 hover:shadow">
            Tasks
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddTodo} className="mb-6 flex gap-3">
          <input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-indigo-500 dark:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 dark:hover:from-indigo-600 dark:hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {editingTodo && editingTodo.id === todo._id ? (
                  <form onSubmit={handleSaveEdit} className="flex-1 flex gap-2">
                    <input
                      value={editingTodo.text}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, text: e.target.value })
                      }
                      className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium py-1 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo({ id: todo._id })}
                      className="h-5 w-5 text-blue-500 dark:text-indigo-400 rounded focus:ring-blue-400 dark:focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 text-gray-700 dark:text-gray-200 ${
                        todo.completed ? "line-through text-gray-400 dark:text-gray-500" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 p-1 rounded-full bg-yellow-50 dark:bg-yellow-900/50 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-all duration-200"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    {deletingTodoId === todo._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={confirmDelete}
                          className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 p-1 rounded-full bg-green-50 dark:bg-green-900/50 hover:bg-green-100 dark:hover:bg-green-800/50 transition-all duration-200"
                          title="Confirm Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                          title="Cancel"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 rounded-full bg-red-50 dark:bg-red-900/50 hover:bg-red-100 dark:hover:bg-red-800/50 transition-all duration-200"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7h6"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}