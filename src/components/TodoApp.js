import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Bolja ikonica za brisanje

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() !== "") {
      setTodos([...todos, task]);
      setTask("");
    }
  };

  const handleDeleteTask = (indexToDelete) => {
    const updatedTodos = todos.filter((_, index) => index !== indexToDelete);
    setTodos(updatedTodos);
  };

  return (
    <div className="todo-app">
      <h1 className="title">My To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task"
          value={task}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={handleAddTask}>
          Add
        </button>
      </div>
      <ul className="task-list">
        {todos.map((todo, index) => (
          <li key={index} className="task-item">
            <span>{todo}</span>
            <button
              className="delete-button"
              onClick={() => handleDeleteTask(index)}
            >
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
