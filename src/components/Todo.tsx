/**
 * @description Отображение одной задачи
 */
import React, { useState, useEffect } from "react";

import docs from "../icons/docs.png";
import del from "../icons/delete.png";
import edit from "../icons/edit.png";
import clsx from "clsx";
import Files from "./Files";
import EditTodo from "./EditTodo";
import { useAppDispatch } from "../hooks/redux-hook";
import { deleteTodo, editTodo } from "../store/slices/TodoSlice";

// свойства и методы props-ов
interface TodoProps {
  id: string;
  todo: string;
  description: string;
  dateComplete: string;
  completed: boolean;
}

const TodoController: React.FC<TodoProps> = ({
  id,
  todo,
  description,
  dateComplete,
  completed,
}) => {
  // выполнена ли задача
  const [check, setCheck] = useState(completed);
  // открыто ли окно со списком файлов
  const [filewindow, setFilewindow] = useState(false);
  // открыто ли окно редактирования задачи
  const [editwindow, setEditwindow] = useState(false);
  // просрочено ли задание
  const [overdue, setOverdue] = useState(false);

  const dispatch = useAppDispatch();

  /**
   * @description - применяет стили к просроченным заданиям, переключает стили во время всплывающих окон для файлов и редактирования
   */
  useEffect(() => {
    if (new Date(dateComplete) < new Date() && !check) {
      setOverdue(true);
    } else {
      setOverdue(false);
    }

    if (filewindow || editwindow) {
      document.querySelector("body")?.classList.add("lock");
    } else {
      document.querySelector("body")?.classList.remove("lock");
    }
  }, [filewindow, editwindow, setOverdue, check, dateComplete]);


  /**
   * @description - Отметить задачу выполненной/невыполненной
   */
  const handleTodo = async () => {
    try {
      setCheck(!check);
      dispatch(
        editTodo({ id, dateComplete, description, todo, completed: !check })
      );
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description - Удаление задачи
   */
  const deletedTodo = async () => {
    dispatch(deleteTodo(id));
  };

  /**
   * @description - Открытие/закрытие окно со списком файлов
   */
  const handleFilewindow = () => {
    setFilewindow(!filewindow);
  };

  return (
    <div
      className={clsx({
        todo: true,
        overdue: overdue,
      })}
    >
      {filewindow && <Files id={id} handleFilewindow={handleFilewindow} />}
      {editwindow && (
        <EditTodo
          handleEditwindow={() => setEditwindow(!editwindow)}
          id={id}
          dateComplete={dateComplete}
          description={description}
          todo={todo}
          completed={completed}
        />
      )}
      <div className="todo__block_1">
        <div className="todo__check">
          <input
            type="checkbox"
            name="check"
            id="check"
            onChange={handleTodo}
            checked={check}
          />
        </div>
        <div className="todo__name">
          <p
            className={clsx({
              text__through: check,
            })}
          >
            {todo}
          </p>
          <span>{dateComplete}</span>
        </div>
      </div>
      <div className="todo__block_2">
        <p
          className={clsx({
            description: true,
            text__disabled: check,
          })}
        >
          {description}
        </p>
      </div>
      <div className="todo__block_3">
        <div className="todo__file button">
          <img
            src={docs}
            alt="Docs"
            onClick={() => setFilewindow(!filewindow)}
          />
        </div>
        <div
          className="todo__edit button"
          onClick={() => setEditwindow(!editwindow)}
        >
          <img src={edit} alt="Edit" />
        </div>
        <div className="todo__delete button">
          <img src={del} alt="Docs" onClick={deletedTodo} />
        </div>
      </div>
    </div>
  );
};

export default TodoController;
