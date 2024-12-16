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

  // Učitaj zadatke i arhive iz localStorage pri učitavanju
  useEffect(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const savedArchived = JSON.parse(localStorage.getItem("archivedTodos")) || [];
      setTodos(savedTodos);
      setArchivedTodos(savedArchived);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Čuvanje zadataka i arhiviranih zadataka u localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("archivedTodos", JSON.stringify(archivedTodos));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [todos, archivedTodos]);

  // Dodavanje zadatka
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

  // Brisanje zadatka
  const handleDeleteTask = (indexToDelete) => {
    setTodos(todos.filter((_, index) => index !== indexToDelete));
  };

  // Arhiviranje zadatka
  const handleArchiveTask = (indexToArchive) => {
    const taskToArchive = todos[indexToArchive];
    setArchivedTodos([...archivedTodos, taskToArchive]);
    handleDeleteTask(indexToArchive);
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

  // Prebacivanje između tamnog i svetlog moda
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Filtrirani zadaci
  const filteredTodos = todos
    .filter((todo) =>
      filterCategory === "All" || todo.category === filterCategory
    )
    .filter((todo) =>
      filterPriority === "All" || todo.priority === filterPriority
    )
    .filter((todo) => todo.text.toLowerCase().includes(searchText.toLowerCase()));

  // Prikaz preostalih dana do roka
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
      <h1 className="title">Enhanced TodoApp</h1>

      <button className="toggle-theme" onClick={toggleTheme}>
        {isDarkMode ? "☀️" : "🌙"}
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

      <div className="input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-dropdown"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-dropdown"
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <p>Total Tasks: {todos.length}</p>
        <p>Archived Tasks: {archivedTodos.length}</p>
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
                <button className="add-button" onClick={() => handleSaveTask(index)}>
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
        {archivedTodos.map((todo) => (
          <li key={todo.id} className="task-item">
            <span className="archived-task">
              {todo.text} ({todo.category}) - {todo.priority}
            </span>
            <span className="task-deadline">{calculateDaysLeft(todo.deadline)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
