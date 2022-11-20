import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, RootState } from "../store"

// кастомный useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
// кастомный useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector