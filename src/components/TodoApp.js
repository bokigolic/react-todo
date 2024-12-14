import { useState } from "react";

const TodoApp = () => {

  const [task, setTask] = useState("");


  const handleInputChange = (e) => {
    setTask(e.target.value)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Add task"
        value={task}
        onChange={handleInputChange}

      />

    </div>
  )
};
export default TodoApp;