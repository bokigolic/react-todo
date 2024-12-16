import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaArchive } from "react-icons/fa";
import "./TodoApp.css";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [archivedTodos, setArchivedTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchText, setSearchText] = useState("");

  const categories = ["All", "Work", "Personal", "Shopping", "Fitness"];
  const priorities = ["All", "High", "Medium", "Low"];

  // Load tasks and archived tasks from localStorage
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedArchived = JSON.parse(localStorage.getItem("archivedTodos")) || [];
    setTodos(savedTodos);
    setArchivedTodos(savedArchived);
  }, []);

  // Save tasks and archived tasks to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("archivedTodos", JSON.stringify(archivedTodos));
  }, [todos, archivedTodos]);

  const handleAddTask = () => {
    if (task.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: task,
          isCompleted: false,
          category: selectedCategory,
          priority: selectedPriority,
          deadline,
        },
      ]);
      setTask("");
      setDeadline("");
    }
  };

  const handleDeleteTask = (indexToDelete) => {
    setTodos(todos.filter((_, index) => index !== indexToDelete));
  };

  const handleArchiveTask = (indexToArchive) => {
    const taskToArchive = todos[indexToArchive];
    setArchivedTodos([...archivedTodos, taskToArchive]);
    handleDeleteTask(indexToArchive);
  };

  const handleRestoreTask = (indexToRestore) => {
    const taskToRestore = archivedTodos[indexToRestore];
    setTodos([...todos, taskToRestore]);
    setArchivedTodos(archivedTodos.filter((_, index) => index !== indexToRestore));
  };

  const handleDeleteArchivedTask = (indexToDelete) => {
    setArchivedTodos(archivedTodos.filter((_, index) => index !== indexToDelete));
  };

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

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const filteredTodos = todos
    .filter((todo) =>
      filterCategory === "All" || todo.category === filterCategory
    )
    .filter((todo) =>
      filterPriority === "All" || todo.priority === filterPriority
    )
    .filter((todo) => todo.text.toLowerCase().includes(searchText.toLowerCase()));

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return "No deadline";
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInMs = deadlineDate - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? `${diffInDays} days left` : "Deadline passed";
  };

  return (
    <div className={`todo-app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h1 className="title">My Enhanced To-Do App</h1>

      <button className="toggle-theme classic-toggle-theme" onClick={toggleTheme}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
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
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
          {priorities.slice(1).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="task-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button className="add-button" onClick={handleAddTask}>
          Add
        </button>
      </div>

      <ul className="task-list">
        {filteredTodos.map((todo, index) => (
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
                <button className="save-button" onClick={() => handleSaveTask(index)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span className={todo.isCompleted ? "completed" : ""}>
                  {todo.text} ({todo.category}) - {todo.priority}
                </span>
                <span className="task-deadline">{calculateDaysLeft(todo.deadline)}</span>
                <button className="edit-button" onClick={() => handleEditTask(index)}>
                  <FaEdit />
                </button>
                <button className="delete-button" onClick={() => handleDeleteTask(index)}>
                  <FaTrashAlt />
                </button>
                <button className="archive-button" onClick={() => handleArchiveTask(index)}>
                  <FaArchive />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Archived Tasks</h2>
      <ul className="task-list">
        {archivedTodos.map((todo, index) => (
          <li key={todo.id} className="task-item">
            <span className="archived-task">
              {todo.text} ({todo.category}) - {todo.priority}
            </span>
            <span className="task-deadline">{calculateDaysLeft(todo.deadline)}</span>
            <button className="restore-button" onClick={() => handleRestoreTask(index)}>
              Restore
            </button>
            <button className="delete-button" onClick={() => handleDeleteArchivedTask(index)}>
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
