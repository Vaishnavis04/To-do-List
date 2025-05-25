import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS

const apiUrl = 'https://task-trail-h9uc.onrender.com/todos';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Fetch todos from the backend API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrl);
        setTodos(response.data);
      } catch (error) {
        console.error('There was an error fetching the todos!', error);
      }
    };
    fetchTodos();
  }, []);

  // Handle adding a new todo
  const addTodo = async () => {
    if (!title || !desc) {
      alert('Title and Description are required.');
      return;
    }
    try {
      const response = await axios.post(apiUrl, { title, desc });
      setTodos([...todos, response.data]);
      setTitle('');
      setDesc('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle completion status of a todo
  const toggleCompletion = async (id, completed) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, { completed: !completed });
      const updatedTodos = todos.map(todo =>
        todo._id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
    setNewDesc(todo.desc);
  };

  // Handle updating a todo
  const updateTodo = async () => {
    if (!newTitle || !newDesc) {
      alert('Title and Description are required.');
      return;
    }
    try {
      const response = await axios.put(`${apiUrl}/${editingTodo._id}`, {
        title: newTitle,
        desc: newDesc,
        completed: editingTodo.completed,
      });
      const updatedTodos = todos.map(todo =>
        todo._id === editingTodo._id ? response.data : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setNewTitle('');
      setNewDesc('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Add Todo Form */}
      <div>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter task description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div>
              <strong>{todo.title}:</strong> {todo.desc}
            </div>
            <div className="buttons">
              <button 
                className={`complete-btn ${todo.completed ? 'completed' : ''}`} 
                onClick={() => toggleCompletion(todo._id, todo.completed)}>
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>
                Delete
              </button>
              <button className="edit-btn" onClick={() => startEditing(todo)}>
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Todo Form */}
      {editingTodo && (
        <div>
          <h2>Edit Todo</h2>
          <input
            type="text"
            placeholder="Edit task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Edit task description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button onClick={updateTodo}>Update Todo</button>
          <button onClick={() => setEditingTodo(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
