/**
 * @description Отображение одного файла
 */

import React from "react";
import del from "../icons/delete.png";

// свойства и методы props-ов
interface FilePropsI {
    url: string;
    name: string;
    path: string;
    deleteFile: (path: string) => Promise<void>
}

const File : React.FC<FilePropsI> = ({url, name, path, deleteFile}) => {
  return (
    <div className="file">
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
      <div
        className="todo__delete button"
        onClick={() => deleteFile(path)}
      >
        <img src={del} alt="Docs" />
      </div>
    </div>
  );
};

export default File;
