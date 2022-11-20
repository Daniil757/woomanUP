import { storage } from './../firebase';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, deleteObject, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

// свойства и методы одного файла
export interface fileI {
    path: string;
    url: string;
    name: string;
}

// свойства и методы списка файлов
interface filesI {
    files: fileI[]
}

// state
const initialState: filesI = {
    files: []
}

/**
 * @async
 * @param {string} path - Путь до файла
 * @returns {string} - Путь до файла
 * @description Удаление файла с выбранной задачи
 */
export const delFile = createAsyncThunk(
    'files/deleteFile',
    async (path: string) => {
        const desertRef = ref(storage, `${path}`);
        try {
            await deleteObject(desertRef)
            return path
        } catch (error) {
            return ''
        }

    }
)

//  свойства и методы входящего параметра в функцию addFile
interface addFileI extends FileList {
    id: string
}

/**
 * @async
 * @param {addFileI} fileData - Объект содержащий id выбранной задачи и масиив с данными о загружаемом файле
 * @returns {fileI} - Объект с данными о добавленном файле
 * @description Добавление файла в выбранную задачу
 */
export const addFile = createAsyncThunk(
    'files/uploadFile',
    async (fileData: addFileI) => {
        const imageRef = ref(storage, `${fileData.id}/${new Date()}_${fileData[0].name}`);
        try {
            const res = await uploadBytes(imageRef, fileData[0]);
            const url = await getDownloadURL(ref(storage, `${res.metadata.fullPath}`))
            return {
                name: res.metadata.name,
                path: res.metadata.fullPath,
                url
            } as fileI
        } catch (error) {
            console.error(error);
            return {
                name: '',
                path: '',
                url: ''
            } as fileI
        }
    }
)

/**
 * @async
 * @param {string} id - id выбранной задачи
 * @returns {fileI[]} - массив со списком файлов по текущей задаче
 * @description Получени файлов по текущей задаче
 */
export const setFiles = createAsyncThunk(
    'files/setFiles',
    async (id: string) => {
        const listRef = ref(storage, `${id}`);
        let filesArray: fileI[] = [];
        try {
            const res = await listAll(listRef);
            if (!res.items) {
                return filesArray
            }            
            for (const item of res.items) {
                const url = await getDownloadURL(ref(storage, `${item.fullPath}`))
                filesArray = [...filesArray,
                {
                    url,
                    name: item.name,
                    path: item.fullPath
                }]
            }
            return filesArray
        } catch (error) {
            console.error(error);
            return filesArray
        }
    }
)

const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(delFile.fulfilled, (state, action) => {
            if (action.payload !== '') {
                state.files = state.files.filter(file => file.path !== action.payload)
            }
        })
        builder.addCase(addFile.fulfilled, (state, action) => {
            if (action.payload.name !== '') {
                state.files = [...state.files, action.payload]
            }
        })
        builder.addCase(setFiles.fulfilled, (state, action) => {
            state.files = action.payload
        })
    }
})

export const fileReducer = fileSlice.reducer