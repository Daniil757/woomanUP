/**
 * @author Даниил Перевозчиков
 */

import React from 'react';
import './styles/App.scss'
import AddTodo from './components/AddTodo';
import LoadTodo from './components/LoadTodo';

function App() {
  return (
    <div className='container'>
      <h1 className='header'>Список дел</h1>

      <AddTodo />
      <LoadTodo />

    </div>
  );
}

export default App;
