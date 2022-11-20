/**
 * @description Добавлние новой задачи
 */

import React, { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hook";
import { createTodo } from "../store/slices/TodoSlice";

const AddTodo = () => {
  // название задачи
  const [todo, setTodo] = useState("");
  // описание задачи
  const [description, setDescription] = useState("");
  // дата и время до которого нужно выполнить задачу
  const [dateComplete, setDateComplete] = useState("");

  const dispatch = useAppDispatch();

  /**
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - Событие отправки формы
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo && description && dateComplete) {
      dispatch(createTodo({ dateComplete, description, todo, completed: false }));
    } else {
      alert('Заполните все поля')
    }
  };

  return (
    <div className="add__todo">
      <form className="add_form" onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setTodo(e.target.value)} />
        <input type="text" onChange={(e) => setDescription(e.target.value)} />
        <input
          type="datetime-local"
          onChange={(e) => setDateComplete(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddTodo;
