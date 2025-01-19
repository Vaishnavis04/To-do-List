import React from 'react';
import TodoList from './TodoList'; // Import the TodoList component
import './App.css'; // Import the CSS for styling

const App = () => {
  return (
    <div className="App">
      <TodoList /> {/* Render the TodoList component */}
    </div>
  );
};

export default App;
