/**
 * @description Редактирование задачи
 */

import React, { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hook";
import { editTodo } from "../store/slices/TodoSlice";

// свойства и методы props-ов
interface EditTodoPropsI {
  id: string;
  todo: string;
  description: string;
  dateComplete: string;
  completed: boolean;
  handleEditwindow: () => void;
}

const EditTodo: React.FC<EditTodoPropsI> = ({
  handleEditwindow,
  id,
  dateComplete,
  description,
  todo,
  completed,
}) => {
  // название задачи
  const [todoName, setTodoName] = useState(todo);
  // описание задачи
  const [desc, setDesc] = useState(description);
  // дата и время до которого нужно выполнить задачу
  const [dateComp, setDateComp] = useState(dateComplete);

  const dispatch = useAppDispatch();

  /**
   * @async
   * @param {React.ChangeEvent<HTMLFormElement>} e - Событие отправки формы
   */
  const saveData = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(
        editTodo({
          id,
          todo: todoName,
          dateComplete: dateComp,
          description: desc,
          completed,
        })
      );
      alert("Данные обновлены");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit__window">
      <span className="files__close" onClick={handleEditwindow}></span>
      <form onSubmit={saveData}>
        <div>
          <input
            type="text"
            onChange={(e) => setTodoName(e.target.value)}
            defaultValue={todo}
          />
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setDesc(e.target.value)}
            defaultValue={description}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            onChange={(e) => setDateComp(e.target.value)}
            defaultValue={dateComplete}
          />
        </div>
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default EditTodo;
