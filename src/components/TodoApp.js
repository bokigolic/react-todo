import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./TodoApp.css";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const categories = ["Work", "Personal", "Shopping", "Fitness"];

  // Praćenje online/offline statusa
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Dodavanje zadatka
  const handleAddTask = () => {
    if (task.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: task, isCompleted: false, category: selectedCategory },
      ]);
      setTask("");
    }
  };

  // Brisanje zadatka
  const handleDeleteTask = (indexToDelete) => {
    const updatedTodos = todos.filter((_, index) => index !== indexToDelete);
    setTodos(updatedTodos);
  };

  // Uređivanje zadatka
  const handleEditTask = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].text);
  };

  const handleSaveTask = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = editingText;
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditingText("");
  };

  // Označavanje završetka zadatka
  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  // Brisanje svih zadataka
  const handleClearAll = () => setTodos([]);

  // Prebacivanje između tamnog i svetlog moda
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Statistika zadataka
  const completedTasks = todos.filter((todo) => todo.isCompleted).length;
  const totalTasks = todos.length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className={`todo-app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h1 className="title">My To-Do List</h1>

      {!isOnline && <div className="offline-banner">You are offline</div>}

      <button className="toggle-theme" onClick={toggleTheme}>
        {isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button className="add-button" onClick={handleAddTask}>
          Add
        </button>
      </div>

      <div className="stats">
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed: {completedTasks}</p>
        <p>Pending: {pendingTasks}</p>
      </div>

      <ul className="task-list">
        {todos.map((todo, index) => (
          <li key={todo.id} className="task-item">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => handleToggleComplete(index)}
            />
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  className="task-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button className="add-button" onClick={() => handleSaveTask(index)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span className={todo.isCompleted ? "completed" : ""}>
                  {todo.text} ({todo.category})
                </span>
                <button className="edit-button" onClick={() => handleEditTask(index)}>
                  <FaEdit />
                </button>
                <button className="delete-button" onClick={() => handleDeleteTask(index)}>
                  <FaTrashAlt />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button className="add-button" onClick={handleClearAll}>
          Clear All
        </button>
      )}
      <footer className="footer">
        <p className="fade-in">
          by Boki &copy; {new Date().getFullYear()}.
        </p>
      </footer>
    </div>
  );
};

export default TodoApp;
