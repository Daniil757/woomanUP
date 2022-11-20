import { configureStore } from "@reduxjs/toolkit";
import { fileReducer } from "./slices/FileSlice";
import { todoReducer } from "./slices/TodoSlice";

const store = configureStore({
    reducer: {
        todo: todoReducer,
        file: fileReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store