import React, { useState, useEffect } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

const TodosContainer = (props) => {

  const [tasks, setTasks] = useState([]);
  const [newTask, setTaskNewTask] = useState('');

  useEffect(() => {
    (async function fetchItems() {
      try {
        const response = await axios.get('/api/v1/todos');
        setTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const createTask = (e) => {
    if (e.key === 'Enter') {
      axios.post('/api/v1/todos', { todo: { title: e.target.value, done: false } })
        .then(response => {
          const todos = update(tasks, {
            $splice: [[0, 0, response.data]]
          });
          setTasks(todos);
          setTaskNewTask('');
        })
        .catch(error => console.log(error))
    }
  };

  const completedTodo = (e, id) => {
    axios.put(`/api/v1/todos/${id}`, { todo: { done: e.target.checked } })
      .then(response => {
        const todoIndex = tasks.findIndex(x => x.id === response.data.id);
        const todos = update(tasks, {
          [todoIndex]: { $set: response.data }
        });
        setTasks(todos);
      })
      .catch(error => console.log(error))
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/v1/todos/${id}`);
      const todoIndex = tasks.findIndex(x => x.id === id)
        const todos = update(tasks, {
          $splice: [[todoIndex, 1]]
        });
        setTasks(todos);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setTaskNewTask(e.target.value);
  }

  return (
    <div>
      <div className="inputContainer">
        <input className="taskInput" type="text"
          placeholder="Add a task" maxLength="50"
          onKeyPress={createTask}
          value={newTask} onChange={handleChange} />
      </div>
      <div className="listWrapper">
        <ul className="taskList">
          {tasks.map((todo) => {
            return (
              <li className="task" todo={todo} key={todo.id}>
                <input className="taskCheckbox" type="checkbox"
                  checked={todo.done}
                  onChange={(e) => completedTodo(e, todo.id)} />
                <label className="taskLabel">{todo.title}</label>
                <span className="deleteTaskBtn"
                  onClick={(e) => deleteTask(todo.id)}>
                  x
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodosContainer;