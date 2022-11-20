import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";


// свойства и методы одной задачи
export interface TodoI {
	id: string;
	todo: string;
	description: string;
	dateComplete: string;
	completed: boolean;
}

// свойства и методы списка задач
interface TodosI {
	todos: TodoI[];
}

// state
const initialState: TodosI = {
	todos: [],
};

// свойства и методы входного параметра в функцию setTodos
interface setTodosI {
	todo: string;
	description: string;
	dateComplete: string;
	completed: boolean;
}

/**
 * @async
 * @returns {TodoI[]} - массив со всеми задачами
 * @description Получени задач с сервера
 */
export const setTodos = createAsyncThunk("todos/setTodos", async () => {
	const todos = await getDocs(collection(db, "todos"));
	let todosData: TodoI[] = [];
	todos.forEach((todo) => {
		let dataTodo = todo.data() as setTodosI;
		todosData = [
			...todosData,
			{
				id: todo.id,
				todo: dataTodo.todo,
				description: dataTodo.description,
				dateComplete: dataTodo.dateComplete,
				completed: dataTodo.completed,
			},
		];
	});
	todosData = todosData.sort((current, next) => new Date(current.dateComplete) < new Date(next.dateComplete) ? 1: -1)
	return todosData;
});

/**
 * @async
 * @param {TodoI} todo - Объект с полями редактируемой задачи
 * @returns {TodoI} - Задача с отредактированными полями
 * @description Редактирование задачи
 */
export const editTodo = createAsyncThunk(
	"todos/editTodo",
	async (todo: TodoI) => {
		try {
			const currentTodo = doc(db, "todos", `${todo.id}`);
			await updateDoc(currentTodo, {
				dateComplete: todo.dateComplete,
				description: todo.description,
				todo: todo.todo,
				completed: todo.completed,
			});
			return {
				id: todo.id,
				dateComplete: todo.dateComplete,
				description: todo.description,
				todo: todo.todo,
				completed: todo.completed,
			};
		} catch (error) {
			alert("ошибка при обновлении");
			return {
				id: "",
				dateComplete: "",
				description: "",
				todo: "",
				completed: todo.completed,
			};
		}
	}
);

/**
 * @async
 * @param {string} id - id удаляемой задачи
 * @returns {string} - id удалённой задачи
 * @description Удаление задачи
 */
export const deleteTodo = createAsyncThunk(
	"todos/deleteTodo",
	async (id: string) => {
		try {
			await deleteDoc(doc(db, "todos", `${id}`));
			return id;
		} catch (error) {
			console.error(error);
			return "";
		}
	}
);

// свойства и методы входящего параметра в функцию createTodo
interface createTodoI {
	todo: string;
	description: string;
	dateComplete: string;
	completed: boolean;
}

/**
 * @async
 * @param {createTodoI} todo - Объект с полями новой задачи (без id)
 * @returns {TodoI} - Объект. Новая задача
 * @description Добавление задачи
 */
export const createTodo = createAsyncThunk(
	'todos/createTodo',
	async (todo: createTodoI) => {
		try {
			const docRef = await addDoc(collection(db, "todos"), {
				todo: todo.todo,
				description: todo.description,
				dateComplete: todo.dateComplete,
				completed: todo.completed
			})
			return {
				id: docRef.id,
				todo: todo.todo,
				description: todo.description,
				dateComplete: todo.dateComplete,
				completed: todo.completed
			}
		} catch (error) {
			console.error(`${error}`)
			return {
				id: "",
				dateComplete: "",
				description: "",
				todo: "",
				completed: todo.completed,
			};
		}
	}
)

const todoSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(setTodos.fulfilled, (state, action) => {
			state.todos = action.payload;
		});
		builder.addCase(editTodo.fulfilled, (state, action) => {
			if (action.payload.id) {
				let todoIndex = state.todos.findIndex(
					(todo) => todo.id === action.payload.id
				);
				state.todos[todoIndex] = action.payload;
				state.todos = state.todos.sort((current, next) => new Date(current.dateComplete) < new Date(next.dateComplete) ? 1: -1)
			}
		});
		builder.addCase(deleteTodo.fulfilled, (state, action) => {
			if (action.payload) {
				state.todos = state.todos.filter((todo) => todo.id !== action.payload);
			}
		});
		builder.addCase(createTodo.fulfilled, (state, action) => {
			state.todos = [...state.todos, action.payload];
			state.todos = state.todos.sort((current, next) => new Date(current.dateComplete) < new Date(next.dateComplete) ? 1: -1)
		})
	},
});

export const todoReducer = todoSlice.reducer;
