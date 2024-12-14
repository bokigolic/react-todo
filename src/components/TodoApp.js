import { useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";

const TodoApp = () => {

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const handleInputChange = (e) => {
    setTask(e.target.value)
  }

  const handleAddTask = () => {
    if (task.trim() !== "") {
      setTodos([...todos, task]);
      setTask("");
    }
  };
  const handleDeleteTask = (indexToDelete) => {
    const updatedTodos = todos.filter((_, index) => index !== indexToDelete)
    setTodos(updatedTodos);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Add task"
        value={task}
        onChange={handleInputChange}
      />
      <button onClick={handleAddTask}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}{" "}
            <button onClick={() => handleDeleteTask(index)}>{<FaDeleteLeft />}</button>
          </li>
        ))}

      </ul>

    </div>
  )
};
export default TodoApp;