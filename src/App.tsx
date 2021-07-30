import React from 'react';
import './App.css';
import TodoCreate from "./coponents/TodoCreate";
import TodoList from "./coponents/TodoList";

function App() {
    return (
    <div className="App">
        <TodoCreate />
        <TodoList />
    </div>
  );
}

export default App;
