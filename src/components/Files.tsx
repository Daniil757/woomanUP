/**
 * @description Окно с файлами текущей задачи
 */

import React, { useState, useEffect, useCallback } from "react";
import upload from "../icons/upload.png";
import File from "./File";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hook";
import { addFile, delFile, setFiles } from "../store/slices/FileSlice";

// свойства и методы props-ов
interface FilesProps {
  id: string;
  handleFilewindow: () => void;
}

const Files: React.FC<FilesProps> = ({ id, handleFilewindow }) => {
  // открыто ли окно со списком файлов
  const [checkFile, setCheckFile] = useState(false);
  // список файлов
  const fileData = useAppSelector(state => state.file.files);
  const dispatch = useAppDispatch();

  /**
   * @async
   * @param {string} path - Путь к файлу
   */
  const deleteFile = async (path: string) => {
    dispatch(delFile(path));
  }

  /**
   * @async
   * @param {React.ChangeEvent<HTMLFormElement>} e - Событие отправки формы
   */
  const uploadFile = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let files = (e.target[0] as HTMLInputElement).files;
    if (files && files[0]) {
      setCheckFile(false);
      dispatch(addFile({...files, id}))
    } else {
      setCheckFile(true);
    }
  };

  /**
   * @description - Получение файлов с сервера
   */
  const getFiles = useCallback(async () => {
    dispatch(setFiles(id))
  }, [id, dispatch])

  /**
   * @description - получает файлы при открытии окна с файлами
   */
  useEffect(() => {
    getFiles();
  }, [getFiles]);

  return (
    <div className="files">
      <span className="files__close" onClick={handleFilewindow}></span>
      <form onSubmit={uploadFile}>
        <input type="file" name="file" id="file" style={{ display: "none" }} />
        <label htmlFor="file">
          <img src={upload} alt="upload" />
        </label>
        {checkFile && <span>Файл не выбран</span>}
        <button type="submit">Добавить</button>
      </form>
      <div className="files__list">
        <h3>Список файлов по данной задаче</h3>
        {fileData.map((file) => (
          <File key={file.url} name={file.name} path={file.path} url={file.url} deleteFile={deleteFile}/>
        ))}
      </div>
    </div>
  );
};

export default Files;
