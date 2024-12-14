import { useState } from "react";

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
          <li key={index}>{todo}</li>
        ))}

      </ul>

    </div>
  )
};
export default TodoApp;