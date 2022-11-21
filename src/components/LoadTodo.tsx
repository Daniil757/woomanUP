/**
 * @description Отрисовка на странице всех задач
 */

import React, { useEffect } from "react";
import Todo from "./Todo";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hook";
import { setTodos } from "../store/slices/TodoSlice";

const LoadTodo = () => {
  const newData = useAppSelector(state => state.todo.todos)
  const dispatch = useAppDispatch()

  /**
   * @description - получает задачи при открытии страницы
   */
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setTodos())
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="load__todo">
      {newData?.map((todo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          completed={todo.completed}
          dateComplete={todo.dateComplete}
          description={todo.description}
          todo={todo.todo}
        />
      ))}
    </div>
  );
};

export default LoadTodo;
